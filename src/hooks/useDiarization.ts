import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DiarizationStatus = 'idle' | 'uploading' | 'queued' | 'processing' | 'completed' | 'error';

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
  confidence: number;
}

interface DiarizationResult {
  text: string;
  utterances: Utterance[];
  audioDuration: number;
}

export function useDiarization() {
  const [status, setStatus] = useState<DiarizationStatus>('idle');
  const [result, setResult] = useState<DiarizationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearPolling();
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
  }, [clearPolling]);

  const processAudio = useCallback(async (file: File, speakersExpected?: number) => {
    try {
      reset();
      setStatus('uploading');

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Start transcription
      const { data: transcribeData, error: transcribeError } = await supabase.functions.invoke('diarize', {
        body: {
          action: 'transcribe',
          audio_base64: base64,
          speakers_expected: speakersExpected || undefined,
        },
      });

      if (transcribeError) {
        throw new Error(transcribeError.message || 'Failed to start transcription');
      }

      if (!transcribeData?.success) {
        throw new Error(transcribeData?.error || 'Failed to start transcription');
      }

      const transcriptId = transcribeData.transcript_id;
      setStatus('queued');
      toast.success('Audio uploaded! Processing started.');

      // Poll for status
      const pollStatus = async () => {
        try {
          const { data: statusData, error: statusError } = await supabase.functions.invoke('diarize', {
            body: {
              action: 'status',
              transcript_id: transcriptId,
            },
          });

          if (statusError) {
            throw new Error(statusError.message || 'Failed to check status');
          }

          if (statusData?.status === 'completed') {
            clearPolling();
            setStatus('completed');
            setResult({
              text: statusData.text,
              utterances: statusData.utterances || [],
              audioDuration: statusData.audio_duration || 0,
            });
            toast.success('Speaker diarization complete!');
            return;
          }

          if (statusData?.status === 'error') {
            clearPolling();
            setStatus('error');
            setErrorMessage(statusData.error || 'Transcription failed');
            toast.error('Transcription failed');
            return;
          }

          if (statusData?.status === 'processing') {
            setStatus('processing');
          }
        } catch (error) {
          console.error('Polling error:', error);
          // Don't stop polling on transient errors
        }
      };

      // Start polling every 3 seconds
      pollingRef.current = setInterval(pollStatus, 3000);
      // Also poll immediately
      pollStatus();

    } catch (error) {
      console.error('Diarization error:', error);
      clearPolling();
      setStatus('error');
      const message = error instanceof Error ? error.message : 'An error occurred';
      setErrorMessage(message);
      toast.error(message);
    }
  }, [reset, clearPolling]);

  return {
    status,
    result,
    errorMessage,
    processAudio,
    reset,
  };
}
