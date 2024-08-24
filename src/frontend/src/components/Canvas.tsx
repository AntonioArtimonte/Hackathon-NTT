import React, { useEffect, RefObject, useRef } from 'react';

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

const Canvas: React.FC<CanvasProps> = ({ canvasRef }) => {
  const prevPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to full window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fill the canvas with the specified background color
    ctx.fillStyle = 'black'; // Your specified background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const revealBackground = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (prevPosRef.current) {
        const prevX = prevPosRef.current.x;
        const prevY = prevPosRef.current.y;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 120; // Fixed base line width
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      prevPosRef.current = { x, y };
    };

    // Add the event listener for mouse movement
    canvas.addEventListener('mousemove', revealBackground);

    return () => {
      // Cleanup event listener when component unmounts
      canvas.removeEventListener('mousemove', revealBackground);
    };
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default Canvas;
