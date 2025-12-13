import { useEffect, useRef } from 'react';

interface WaveformVisualProps {
  animate?: boolean;
  className?: string;
}

export function WaveformVisual({ animate = true, className = '' }: WaveformVisualProps) {
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

    const draw = () => {
      const width = canvas.width / 2;
      const height = canvas.height / 2;
      
      ctx.clearRect(0, 0, width, height);

      const barCount = 50;
      const barWidth = width / barCount - 2;
      const maxHeight = height * 0.8;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'hsl(175 80% 50%)');
      gradient.addColorStop(0.5, 'hsl(280 70% 55%)');
      gradient.addColorStop(1, 'hsl(175 80% 50%)');

      ctx.fillStyle = gradient;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        
        // Create organic wave pattern with multiple frequencies
        const freq1 = Math.sin((i / barCount) * Math.PI * 2 + timeRef.current * 0.02) * 0.3;
        const freq2 = Math.sin((i / barCount) * Math.PI * 4 + timeRef.current * 0.03) * 0.2;
        const freq3 = Math.sin((i / barCount) * Math.PI * 6 + timeRef.current * 0.015) * 0.15;
        const noise = Math.random() * 0.1;
        
        const normalizedHeight = 0.3 + freq1 + freq2 + freq3 + noise;
        const barHeight = Math.max(4, normalizedHeight * maxHeight);
        
        const y = (height - barHeight) / 2;
        
        // Draw rounded bars
        const radius = barWidth / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, radius);
        ctx.fill();
      }

      if (animate) {
        timeRef.current += 1;
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}
