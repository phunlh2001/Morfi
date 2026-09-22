import React, { useEffect, useRef } from 'react';

interface MorfiLogoProps {
  size?: number;
  className?: string;
  showBackground?: boolean;
}

export const MorfiLogo: React.FC<MorfiLogoProps> = ({
  size = 38,
  className = '',
  showBackground = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Base coordinate scaling factor based on 100x100 virtual grid
    const s = size / 100;

    // 1. Optional background rounded container
    if (showBackground) {
      const radius = 22 * s;
      ctx.beginPath();
      ctx.roundRect(4 * s, 4 * s, 92 * s, 92 * s, radius);
      
      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, size, size);
      bgGrad.addColorStop(0, '#1e1b4b'); // Deep indigo
      bgGrad.addColorStop(0.5, '#0f172a'); // Slate dark
      bgGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Border glow
      ctx.lineWidth = 1.5 * s;
      const borderGrad = ctx.createLinearGradient(0, 0, size, size);
      borderGrad.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
      borderGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.4)');
      borderGrad.addColorStop(1, 'rgba(6, 182, 212, 0.7)');
      ctx.strokeStyle = borderGrad;
      ctx.stroke();
    }

    // 2. Draw "M" on the left
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Outer glow for M
    ctx.shadowColor = 'rgba(99, 102, 241, 0.6)';
    ctx.shadowBlur = 8 * s;

    const mGrad = ctx.createLinearGradient(16 * s, 25 * s, 48 * s, 75 * s);
    mGrad.addColorStop(0, '#818cf8'); // Indigo
    mGrad.addColorStop(0.5, '#c084fc'); // Purple
    mGrad.addColorStop(1, '#f472b6'); // Pink

    ctx.fillStyle = mGrad;

    // Modern polygon M shape
    ctx.beginPath();
    ctx.moveTo(18 * s, 74 * s);
    ctx.lineTo(18 * s, 28 * s);
    ctx.lineTo(26 * s, 28 * s);
    ctx.lineTo(34 * s, 49 * s);
    ctx.lineTo(42 * s, 28 * s);
    ctx.lineTo(50 * s, 28 * s);
    ctx.lineTo(50 * s, 74 * s);
    ctx.lineTo(43 * s, 74 * s);
    ctx.lineTo(43 * s, 41 * s);
    ctx.lineTo(36.5 * s, 60 * s);
    ctx.lineTo(31.5 * s, 60 * s);
    ctx.lineTo(25 * s, 41 * s);
    ctx.lineTo(25 * s, 74 * s);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3. Dynamic Transfer Motion Waves / Arrows (Center transition)
    ctx.save();
    const arrowGrad = ctx.createLinearGradient(48 * s, 50 * s, 60 * s, 50 * s);
    arrowGrad.addColorStop(0, 'rgba(192, 132, 252, 0.9)');
    arrowGrad.addColorStop(1, 'rgba(56, 189, 248, 0.9)');

    ctx.strokeStyle = arrowGrad;
    ctx.lineWidth = 2.2 * s;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Transfer chevron 1
    ctx.beginPath();
    ctx.moveTo(51 * s, 43 * s);
    ctx.lineTo(55 * s, 50 * s);
    ctx.lineTo(51 * s, 57 * s);
    ctx.stroke();

    // Transfer chevron 2
    ctx.beginPath();
    ctx.moveTo(56 * s, 43 * s);
    ctx.lineTo(60 * s, 50 * s);
    ctx.lineTo(56 * s, 57 * s);
    ctx.stroke();

    // Small active particle dots
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(54 * s, 34 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(58 * s, 65 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Draw File Document Icon on the right (with folded corner)
    ctx.save();
    ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
    ctx.shadowBlur = 6 * s;

    const fileX = 64 * s;
    const fileY = 28 * s;
    const fileW = 24 * s;
    const fileH = 46 * s;
    const foldSize = 8 * s;

    // File body with cut corner
    ctx.beginPath();
    ctx.moveTo(fileX, fileY);
    ctx.lineTo(fileX + fileW - foldSize, fileY);
    ctx.lineTo(fileX + fileW, fileY + foldSize);
    ctx.lineTo(fileX + fileW, fileY + fileH);
    ctx.lineTo(fileX, fileY + fileH);
    ctx.closePath();

    // File fill gradient
    const fileFill = ctx.createLinearGradient(fileX, fileY, fileX + fileW, fileY + fileH);
    fileFill.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
    fileFill.addColorStop(1, 'rgba(99, 102, 241, 0.35)');
    ctx.fillStyle = fileFill;
    ctx.fill();

    // File outline
    const fileStroke = ctx.createLinearGradient(fileX, fileY, fileX + fileW, fileY + fileH);
    fileStroke.addColorStop(0, '#38bdf8');
    fileStroke.addColorStop(1, '#818cf8');
    ctx.strokeStyle = fileStroke;
    ctx.lineWidth = 1.8 * s;
    ctx.stroke();

    // Folded corner flap
    ctx.beginPath();
    ctx.moveTo(fileX + fileW - foldSize, fileY);
    ctx.lineTo(fileX + fileW - foldSize, fileY + foldSize);
    ctx.lineTo(fileX + fileW, fileY + foldSize);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    // Document lines inside the file (≡)
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.85)';
    ctx.lineWidth = 1.8 * s;
    ctx.lineCap = 'round';

    // Line 1
    ctx.beginPath();
    ctx.moveTo(fileX + 5 * s, fileY + 16 * s);
    ctx.lineTo(fileX + fileW - 5 * s, fileY + 16 * s);
    ctx.stroke();

    // Line 2
    ctx.beginPath();
    ctx.moveTo(fileX + 5 * s, fileY + 24 * s);
    ctx.lineTo(fileX + fileW - 5 * s, fileY + 24 * s);
    ctx.stroke();

    // Line 3 (shorter)
    ctx.beginPath();
    ctx.moveTo(fileX + 5 * s, fileY + 32 * s);
    ctx.lineTo(fileX + fileW - 10 * s, fileY + 32 * s);
    ctx.stroke();

    ctx.restore();

    ctx.restore();
  }, [size, showBackground]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`shrink-0 block ${className}`}
      title="Morfi - Universal File Converter"
    />
  );
};
