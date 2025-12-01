import { Download, FileText, FileJson, Subtitles, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

const speakerColorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  A: { bg: '#0d3d3d', border: '#14b8a6', text: '#14b8a6', badge: '#14b8a6' },
  B: { bg: '#3d1a4d', border: '#a855f7', text: '#a855f7', badge: '#a855f7' },
  C: { bg: '#3d2a0d', border: '#f59e0b', text: '#f59e0b', badge: '#f59e0b' },
  D: { bg: '#3d1a2a', border: '#ec4899', text: '#ec4899', badge: '#ec4899' },
  E: { bg: '#1a3d1a', border: '#22c55e', text: '#22c55e', badge: '#22c55e' },
};

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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    if (minutes === 0) return `${remainingSeconds}s`;
    return `${minutes}m ${remainingSeconds}s`;
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
      '='.repeat(40),
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

  const generateStyledHtml = () => {
    const uniqueSpeakers = [...new Set(utterances.map(u => u.speaker))].sort();
    const speakerStats: Record<string, number> = {};
    utterances.forEach(u => {
      const duration = (u.end - u.start) / 1000;
      speakerStats[u.speaker] = (speakerStats[u.speaker] || 0) + duration;
    });

    const timelineSegments = utterances.map(u => {
      const startPercent = (u.start / (audioDuration * 1000)) * 100;
      const widthPercent = ((u.end - u.start) / (audioDuration * 1000)) * 100;
      const color = speakerColorMap[u.speaker]?.badge || '#666';
      return `<div style="position: absolute; left: ${startPercent}%; width: ${Math.max(widthPercent, 0.5)}%; height: 100%; background: ${color}; opacity: 0.8;"></div>`;
    }).join('');

    const utteranceHtml = utterances.map(u => {
      const colors = speakerColorMap[u.speaker] || { bg: '#2a2a2a', border: '#666', text: '#999', badge: '#666' };
      return `
        <div style="background: ${colors.bg}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="background: ${colors.badge}; color: #0a0a0f; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 14px;">
              Speaker ${u.speaker}
            </span>
            <span style="color: #888; font-family: 'JetBrains Mono', monospace; font-size: 13px;">
              ${formatTime(u.start)} - ${formatTime(u.end)}
            </span>
          </div>
          <p style="color: #e5e5e5; line-height: 1.6; margin: 0;">${u.text}</p>
        </div>
      `;
    }).join('');

    const speakerLegend = uniqueSpeakers.map(speaker => {
      const colors = speakerColorMap[speaker] || { badge: '#666' };
      return `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="background: ${colors.badge}; color: #0a0a0f; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">
            ${speaker}
          </span>
          <span style="color: #888;">${formatDuration(speakerStats[speaker] || 0)}</span>
        </div>
      `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Speaker Diarization Report</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Space Grotesk', sans-serif;
      background: linear-gradient(145deg, #0a0a0f, #0d0d14);
      color: #e5e5e5;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container { max-width: 800px; margin: 0 auto; }
    .card {
      background: linear-gradient(145deg, #14141c, #0d0d14);
      border: 1px solid #1f1f2e;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(135deg, #14b8a6, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: center;
      margin-bottom: 8px;
    }
    .subtitle { text-align: center; color: #888; margin-bottom: 32px; }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .stat { text-align: center; }
    .stat-label { color: #888; font-size: 14px; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .stat-value { font-size: 24px; font-weight: 600; }
    .speaker-legend { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; margin-top: 16px; }
    h2 { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
    .timeline-container { position: relative; height: 32px; background: #1f1f2e; border-radius: 8px; overflow: hidden; }
    .timeline-labels { display: flex; justify-content: space-between; color: #666; font-size: 12px; margin-top: 8px; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 32px; }
    @media print {
      body { background: #0a0a0f; }
      .card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Speaker Diarization Report</h1>
    <p class="subtitle">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    
    <div class="card">
      <div class="stats-grid">
        <div class="stat">
          <div class="stat-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Duration
          </div>
          <div class="stat-value">${formatDuration(audioDuration)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Speakers
          </div>
          <div class="stat-value">${uniqueSpeakers.length}</div>
        </div>
      </div>
      <div class="speaker-legend">${speakerLegend}</div>
    </div>

    <div class="card">
      <h2>Timeline</h2>
      <div class="timeline-container">${timelineSegments}</div>
      <div class="timeline-labels">
        <span>0:00</span>
        <span>${formatDuration(audioDuration)}</span>
      </div>
    </div>

    <div class="card">
      <h2>Transcript</h2>
      ${utteranceHtml}
    </div>

    <p class="footer">Speaker Diarization Report • Powered by AssemblyAI</p>
  </div>
</body>
</html>`;
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

  const handleDownloadHtml = () => {
    downloadFile(generateStyledHtml(), 'diarization-report.html', 'text/html');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="gap-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={handleDownloadHtml} className="gap-2 cursor-pointer">
          <FileCode className="h-4 w-4 text-primary" />
          <div>
            <div className="font-medium">Styled Report</div>
            <div className="text-xs text-muted-foreground">Same theme (.html)</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
