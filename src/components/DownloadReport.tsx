import { Download, FileText, FileJson, Subtitles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
  confidence: number;
}

interface DownloadReportProps {
  utterances: Utterance[];
  audioDuration: number;
}

export function DownloadReport({ utterances, audioDuration }: DownloadReportProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatSrtTime = (ms: number) => {
    const totalSeconds = ms / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor(ms % 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const generateTxt = () => {
    const lines = [
      'SPEAKER DIARIZATION REPORT',
      '=' .repeat(40),
      `Total Duration: ${Math.round(audioDuration)} seconds`,
      `Total Speakers: ${new Set(utterances.map(u => u.speaker)).size}`,
      '',
      'TRANSCRIPT',
      '-'.repeat(40),
      '',
    ];

    utterances.forEach(utterance => {
      lines.push(`[${formatTime(utterance.start)} - ${formatTime(utterance.end)}] Speaker ${utterance.speaker}:`);
      lines.push(utterance.text);
      lines.push('');
    });

    return lines.join('\n');
  };

  const generateSrt = () => {
    return utterances.map((utterance, index) => {
      return [
        index + 1,
        `${formatSrtTime(utterance.start)} --> ${formatSrtTime(utterance.end)}`,
        `[Speaker ${utterance.speaker}] ${utterance.text}`,
        '',
      ].join('\n');
    }).join('\n');
  };

  const generateJson = () => {
    const uniqueSpeakers = [...new Set(utterances.map(u => u.speaker))];
    const speakerStats: Record<string, number> = {};
    utterances.forEach(u => {
      const duration = (u.end - u.start) / 1000;
      speakerStats[u.speaker] = (speakerStats[u.speaker] || 0) + duration;
    });

    const report = {
      metadata: {
        totalDuration: audioDuration,
        totalSpeakers: uniqueSpeakers.length,
        speakers: uniqueSpeakers,
        speakerDurations: speakerStats,
        exportedAt: new Date().toISOString(),
      },
      utterances: utterances.map(u => ({
        speaker: u.speaker,
        text: u.text,
        startMs: u.start,
        endMs: u.end,
        startFormatted: formatTime(u.start),
        endFormatted: formatTime(u.end),
        confidence: u.confidence,
      })),
    };

    return JSON.stringify(report, null, 2);
  };

  const handleDownloadTxt = () => {
    downloadFile(generateTxt(), 'diarization-report.txt', 'text/plain');
  };

  const handleDownloadSrt = () => {
    downloadFile(generateSrt(), 'diarization-subtitles.srt', 'text/plain');
  };

  const handleDownloadJson = () => {
    downloadFile(generateJson(), 'diarization-data.json', 'application/json');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleDownloadTxt} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4" />
          Plain Text (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadSrt} className="gap-2 cursor-pointer">
          <Subtitles className="h-4 w-4" />
          Subtitles (.srt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadJson} className="gap-2 cursor-pointer">
          <FileJson className="h-4 w-4" />
          JSON Data (.json)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
