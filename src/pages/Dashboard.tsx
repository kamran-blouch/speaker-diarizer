import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioUploader } from '@/components/AudioUploader';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { TranscriptResult } from '@/components/TranscriptResult';
import { SpeakerSettings } from '@/components/SpeakerSettings';
import { useDiarization } from '@/hooks/useDiarization';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [speakersExpected, setSpeakersExpected] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const { status, result, errorMessage, processAudio, reset } = useDiarization();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Save transcription to database when completed
  useEffect(() => {
    const saveTranscription = async () => {
      if (status === 'completed' && result && user && selectedFile) {
        setSaving(true);
        try {
          // Get unique speakers count
          const uniqueSpeakers = new Set(result.utterances.map(u => u.speaker)).size;
          
          const { error } = await supabase.from('transcriptions').insert([{
            user_id: user.id,
            file_name: selectedFile.name,
            full_text: result.text,
            utterances: JSON.parse(JSON.stringify(result.utterances)),
            audio_duration: result.audioDuration,
            speakers_count: uniqueSpeakers,
            status: 'completed',
          }]);

          if (error) {
            console.error('Error saving transcription:', error);
            toast.error('Failed to save transcription to history');
          } else {
            toast.success('Transcription saved to history');
          }
        } catch (err) {
          console.error('Error saving transcription:', err);
        } finally {
          setSaving(false);
        }
      }
    };

    saveTranscription();
  }, [status, result, user, selectedFile]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    reset();
  };

  const handleProcess = () => {
    if (selectedFile) {
      processAudio(selectedFile, speakersExpected);
    }
  };

  const handleNewAnalysis = () => {
    setSelectedFile(null);
    setSpeakersExpected(0);
    reset();
  };

  const isProcessing = status === 'uploading' || status === 'queued' || status === 'processing';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Background gradient effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <main className="flex-1 relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Speaker Analysis</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your audio and let AI identify who spoke when.
            </p>
          </header>

          {/* Main Content */}
          <div className="space-y-6">
            {status === 'idle' && (
              <>
                <AudioUploader
                  onFileSelect={handleFileSelect}
                  isProcessing={isProcessing}
                  selectedFile={selectedFile}
                  onClear={handleClear}
                />

                {selectedFile && (
                  <>
                    <SpeakerSettings
                      speakersExpected={speakersExpected}
                      onSpeakersChange={setSpeakersExpected}
                      disabled={isProcessing}
                    />

                    <div className="flex justify-center">
                      <Button
                        onClick={handleProcess}
                        size="lg"
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background font-semibold px-8 glow-primary"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Analyze Speakers
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}

            {isProcessing && (
              <ProcessingStatus status={status} />
            )}

            {status === 'error' && (
              <>
                <ProcessingStatus status="error" errorMessage={errorMessage} />
                <div className="flex justify-center">
                  <Button onClick={handleNewAnalysis} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </>
            )}

            {status === 'completed' && result && (
              <>
                {saving && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Saving to history...</span>
                  </div>
                )}
                <TranscriptResult
                  utterances={result.utterances}
                  audioDuration={result.audioDuration}
                />
                <div className="flex justify-center pt-4">
                  <Button onClick={handleNewAnalysis} variant="outline" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Analyze Another Audio
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
