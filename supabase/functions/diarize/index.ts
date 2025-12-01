import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ASSEMBLYAI_API_KEY = Deno.env.get('ASSEMBLYAI_API_KEY');
    
    if (!ASSEMBLYAI_API_KEY) {
      throw new Error('ASSEMBLYAI_API_KEY is not configured');
    }

    const { action, audio_base64, transcript_id, speakers_expected } = await req.json();
    
    console.log(`Processing action: ${action}`);

    // Action: Upload audio and start transcription
    if (action === 'transcribe') {
      if (!audio_base64) {
        throw new Error('No audio data provided');
      }

      console.log('Uploading audio to AssemblyAI...');
      
      // Convert base64 to binary
      const binaryString = atob(audio_base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Upload audio to AssemblyAI
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLYAI_API_KEY,
          'Content-Type': 'application/octet-stream',
        },
        body: bytes,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Failed to upload audio: ${errorText}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('Audio uploaded, URL:', uploadResult.upload_url);

      // Start transcription with speaker diarization
      const transcriptBody: Record<string, unknown> = {
        audio_url: uploadResult.upload_url,
        speaker_labels: true,
      };

      // Add speaker count hints if provided
      if (speakers_expected && speakers_expected > 0) {
        transcriptBody.speakers_expected = speakers_expected;
      }

      console.log('Starting transcription with speaker diarization...');
      
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLYAI_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transcriptBody),
      });

      if (!transcriptResponse.ok) {
        const errorText = await transcriptResponse.text();
        console.error('Transcription request failed:', errorText);
        throw new Error(`Failed to start transcription: ${errorText}`);
      }

      const transcriptResult = await transcriptResponse.json();
      console.log('Transcription started, ID:', transcriptResult.id);

      return new Response(
        JSON.stringify({
          success: true,
          transcript_id: transcriptResult.id,
          status: transcriptResult.status,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Check transcription status
    if (action === 'status') {
      if (!transcript_id) {
        throw new Error('No transcript_id provided');
      }

      console.log('Checking status for transcript:', transcript_id);

      const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcript_id}`, {
        method: 'GET',
        headers: {
          'Authorization': ASSEMBLYAI_API_KEY,
        },
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Status check failed:', errorText);
        throw new Error(`Failed to check status: ${errorText}`);
      }

      const result = await statusResponse.json();
      console.log('Transcript status:', result.status);

      // If completed, return full result with utterances
      if (result.status === 'completed') {
        return new Response(
          JSON.stringify({
            success: true,
            status: result.status,
            text: result.text,
            utterances: result.utterances,
            words: result.words,
            audio_duration: result.audio_duration,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If error, return error message
      if (result.status === 'error') {
        return new Response(
          JSON.stringify({
            success: false,
            status: result.status,
            error: result.error,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Otherwise return queued/processing status
      return new Response(
        JSON.stringify({
          success: true,
          status: result.status,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error('Error in diarize function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
