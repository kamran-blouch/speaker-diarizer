import { useState } from 'react';
import { AudioUploader } from '@/components/AudioUploader';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { TranscriptResult } from '@/components/TranscriptResult';
import { SpeakerSettings } from '@/components/SpeakerSettings';
import { useDiarization } from '@/hooks/useDiarization';
import { Button } from '@/components/ui/button';
import { Mic, RefreshCw, Sparkles } from 'lucide-react';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [speakersExpected, setSpeakersExpected] = useState<number>(0);
  const { status, result, errorMessage, processAudio, reset } = useDiarization();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse-glow" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
                <Mic className="h-10 w-10 text-background" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Speaker Diarization</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your audio and let AI identify who spoke when. 
            Powered by AssemblyAI's advanced speech recognition.
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
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
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Built with AssemblyAI • Speaker identification powered by AI
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
