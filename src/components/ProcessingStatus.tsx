import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'uploading' | 'queued' | 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

export function ProcessingStatus({ status, errorMessage }: ProcessingStatusProps) {
  const statusConfig = {
    uploading: {
      title: 'Uploading Audio',
      description: 'Sending your file to the server...',
      showWaveform: false,
    },
    queued: {
      title: 'Queued for Processing',
      description: 'Your audio is in the queue...',
      showWaveform: true,
    },
    processing: {
      title: 'Analyzing Speakers',
      description: 'AI is identifying different speakers in your audio...',
      showWaveform: true,
    },
    completed: {
      title: 'Analysis Complete',
      description: 'Speaker diarization finished!',
      showWaveform: false,
    },
    error: {
      title: 'Error Occurred',
      description: errorMessage || 'Something went wrong',
      showWaveform: false,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="card-gradient rounded-xl border border-border p-8">
      <div className="flex flex-col items-center text-center">
        {status !== 'error' && status !== 'completed' && (
          <div className="mb-6 flex items-center justify-center gap-1">
            {config.showWaveform ? (
              // Waveform animation
              <div className="flex items-end gap-1 h-12">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-primary rounded-full waveform-line"
                    style={{
                      height: '100%',
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            )}
          </div>
        )}
        
        {status === 'completed' && (
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
            <svg className="h-8 w-8 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )}

        <h3 className="mb-2 text-xl font-semibold text-foreground">
          {config.title}
        </h3>
        <p className="text-muted-foreground">
          {config.description}
        </p>
      </div>
    </div>
  );
}
