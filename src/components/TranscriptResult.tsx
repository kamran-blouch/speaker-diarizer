import { useMemo } from 'react';
import { Clock, Users } from 'lucide-react';
import { DownloadReport } from './DownloadReport';

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
  confidence: number;
}

interface TranscriptResultProps {
  utterances: Utterance[];
  audioDuration: number;
}

const speakerColors: Record<string, string> = {
  A: 'bg-speaker-a/20 border-speaker-a text-speaker-a',
  B: 'bg-speaker-b/20 border-speaker-b text-speaker-b',
  C: 'bg-speaker-c/20 border-speaker-c text-speaker-c',
  D: 'bg-speaker-d/20 border-speaker-d text-speaker-d',
  E: 'bg-speaker-e/20 border-speaker-e text-speaker-e',
};

const speakerBadgeColors: Record<string, string> = {
  A: 'bg-speaker-a text-background',
  B: 'bg-speaker-b text-background',
  C: 'bg-speaker-c text-background',
  D: 'bg-speaker-d text-background',
  E: 'bg-speaker-e text-background',
};

export function TranscriptResult({ utterances, audioDuration }: TranscriptResultProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    if (minutes === 0) return `${remainingSeconds}s`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const uniqueSpeakers = useMemo(() => {
    const speakers = new Set(utterances.map(u => u.speaker));
    return Array.from(speakers).sort();
  }, [utterances]);

  const speakerStats = useMemo(() => {
    const stats: Record<string, number> = {};
    utterances.forEach(u => {
      const duration = (u.end - u.start) / 1000;
      stats[u.speaker] = (stats[u.speaker] || 0) + duration;
    });
    return stats;
  }, [utterances]);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="card-gradient rounded-xl border border-border p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
          <DownloadReport utterances={utterances} audioDuration={audioDuration} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Duration</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {formatDuration(audioDuration)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Speakers</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {uniqueSpeakers.length}
            </p>
          </div>
          <div className="text-center col-span-2">
            <div className="text-sm text-muted-foreground mb-2">Speaker Distribution</div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {uniqueSpeakers.map(speaker => (
                <div key={speaker} className="flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${speakerBadgeColors[speaker] || 'bg-muted text-muted-foreground'}`}>
                    {speaker}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(speakerStats[speaker] || 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="card-gradient rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Timeline</h3>
        <div className="relative h-8 bg-secondary rounded-lg overflow-hidden">
          {utterances.map((utterance, index) => {
            const startPercent = (utterance.start / (audioDuration * 1000)) * 100;
            const widthPercent = ((utterance.end - utterance.start) / (audioDuration * 1000)) * 100;
            const colorClass = speakerColors[utterance.speaker]?.split(' ')[0] || 'bg-muted';
            
            return (
              <div
                key={index}
                className={`absolute top-0 h-full ${colorClass} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                style={{
                  left: `${startPercent}%`,
                  width: `${Math.max(widthPercent, 0.5)}%`,
                }}
                title={`Speaker ${utterance.speaker}: ${formatTime(utterance.start)} - ${formatTime(utterance.end)}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0:00</span>
          <span>{formatDuration(audioDuration)}</span>
        </div>
      </div>

      {/* Transcript */}
      <div className="card-gradient rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Transcript</h3>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {utterances.map((utterance, index) => (
            <div
              key={index}
              className={`rounded-lg border p-4 transition-all hover:shadow-md ${speakerColors[utterance.speaker] || 'bg-secondary/50 border-border'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${speakerBadgeColors[utterance.speaker] || 'bg-muted text-muted-foreground'}`}>
                  Speaker {utterance.speaker}
                </span>
                <span className="text-sm text-muted-foreground font-mono">
                  {formatTime(utterance.start)} - {formatTime(utterance.end)}
                </span>
              </div>
              <p className="text-foreground leading-relaxed">
                {utterance.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
