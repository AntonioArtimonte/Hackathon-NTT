import React, { useRef } from 'react';
import Canvas from '../components/Canvas';
import Cursor from '../components/Cursor';
import LogoAndPhrase from '../components/LogoAndPhrase';

interface ScratchOffEffectProps {
  disableCursor: boolean;
}

const ScratchOffEffect: React.FC<ScratchOffEffectProps> = ({ disableCursor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Define points where the cursor should transform
  const transformPoints = [
    { x: 1000, y: 400, size: 100 }, // Example point
    { x: 1120, y: 420, size: 100 }, // Example point
    // Add more points as needed
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundImage: 'url("/japan.jpg")', // Your specified image path
        backgroundSize: 'cover',
        cursor: 'none', // Hide the default cursor
      }}
    >
      <Canvas canvasRef={canvasRef} />
      <LogoAndPhrase />
      {!disableCursor && <Cursor transformPoints={transformPoints} />}
    </div>
  );
};

export default ScratchOffEffect;
