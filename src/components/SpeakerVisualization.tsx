import { useEffect, useRef } from 'react';

interface SpeakerVisualizationProps {
  speakerCount?: number;
  animate?: boolean;
}

const SPEAKER_COLORS = [
  'hsl(175, 80%, 50%)',
  'hsl(280, 70%, 55%)',
  'hsl(35, 95%, 55%)',
  'hsl(340, 75%, 55%)',
  'hsl(120, 60%, 45%)',
];

export function SpeakerVisualization({ speakerCount = 3, animate = true }: SpeakerVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const speakers: { x: number; y: number; vx: number; vy: number; color: string; radius: number }[] = [];
    
    for (let i = 0; i < speakerCount; i++) {
      speakers.push({
        x: Math.random() * (canvas.width / 2),
        y: Math.random() * (canvas.height / 2),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        color: SPEAKER_COLORS[i % SPEAKER_COLORS.length],
        radius: 20 + Math.random() * 15,
      });
    }

    const draw = () => {
      const width = canvas.width / 2;
      const height = canvas.height / 2;
      
      ctx.fillStyle = 'hsla(220, 20%, 6%, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw speakers
      speakers.forEach((speaker, idx) => {
        if (animate) {
          speaker.x += speaker.vx;
          speaker.y += speaker.vy;

          // Bounce off walls
          if (speaker.x < speaker.radius || speaker.x > width - speaker.radius) {
            speaker.vx *= -1;
          }
          if (speaker.y < speaker.radius || speaker.y > height - speaker.radius) {
            speaker.vy *= -1;
          }
        }

        // Draw glow
        const gradient = ctx.createRadialGradient(
          speaker.x, speaker.y, 0,
          speaker.x, speaker.y, speaker.radius * 3
        );
        gradient.addColorStop(0, speaker.color.replace(')', ', 0.4)').replace('hsl', 'hsla'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(speaker.x, speaker.y, speaker.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(speaker.x, speaker.y, speaker.radius, 0, Math.PI * 2);
        ctx.fillStyle = speaker.color;
        ctx.fill();

        // Draw pulse ring
        const pulseRadius = speaker.radius + Math.sin(timeRef.current * 0.05 + idx) * 10 + 15;
        ctx.beginPath();
        ctx.arc(speaker.x, speaker.y, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = speaker.color.replace(')', ', 0.3)').replace('hsl', 'hsla');
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw speaker label
        ctx.fillStyle = 'hsl(220, 20%, 6%)';
        ctx.font = 'bold 14px Space Grotesk';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String.fromCharCode(65 + idx), speaker.x, speaker.y);
      });

      // Draw connection lines between speakers
      ctx.strokeStyle = 'hsla(175, 80%, 50%, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < speakers.length; i++) {
        for (let j = i + 1; j < speakers.length; j++) {
          ctx.beginPath();
          ctx.moveTo(speakers[i].x, speakers[i].y);
          ctx.lineTo(speakers[j].x, speakers[j].y);
          ctx.stroke();
        }
      }

      timeRef.current += 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speakerCount, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
      style={{ display: 'block' }}
    />
  );
}
