import React, { useEffect, useState, useRef } from 'react';

interface CursorProps {
  transformPoints: { x: number; y: number; size: number }[];
}

const Cursor: React.FC<CursorProps> = ({ transformPoints }) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [radius, setRadius] = useState(70); // Base cursor radius
  const [isTransforming, setIsTransforming] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedPoint, setLockedPoint] = useState<{ x: number; y: number; size: number } | null>(null);
  const prevPosRef = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      let targetX = e.clientX;
      let targetY = e.clientY;

      // Check if cursor is near any transform point
      const nearestPoint = transformPoints.find(point => {
        const dx = targetX - point.x;
        const dy = targetY - point.y;
        return Math.sqrt(dx * dx + dy * dy) < point.size;
      });

      if (nearestPoint) {
        if (!isLocked) {
          // Apply the transformation when the cursor enters the region
          setIsTransforming(true);
          setIsLocked(true);
          setRadius(nearestPoint.size); // Set the square size to match the region size
          setPosition({ x: nearestPoint.x, y: nearestPoint.y });
        }
        // Keep the cursor locked to the center of the nearest transform point
        setLockedPoint({ x: nearestPoint.x, y: nearestPoint.y, size: nearestPoint.size });
      } else {
        // Unlock and allow cursor to move freely
        setIsTransforming(false);
        setIsLocked(false);
        setLockedPoint(null);
        setPosition({ x: targetX, y: targetY });
      }

      if (prevPosRef.current && !isLocked) {
        const prevX = prevPosRef.current.x;
        const prevY = prevPosRef.current.y;

        // Calculate speed
        const dx = targetX - prevX;
        const dy = targetY - prevY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        // Adjust cursor radius based on speed (steeper increase)
        const baseRadius = 40;
        const speedFactor = 0.2; // Adjust the steepness here
        setRadius(baseRadius + speed * speedFactor);
      }

      prevPosRef.current = { x: targetX, y: targetY };
    };

    const smoothReturnToBaseRadius = () => {
      setRadius(prevRadius => {
        const baseRadius = 40;
        const smoothingFactor = 0.1; // Adjust the smoothing here
        return prevRadius - (prevRadius - baseRadius) * smoothingFactor;
      });

      animationFrameRef.current = requestAnimationFrame(smoothReturnToBaseRadius);
    };

    const onMouseMove = (e: MouseEvent) => {
      updatePosition(e);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      smoothReturnToBaseRadius();
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [transformPoints, isLocked]);

  return (
    <div
      className="custom-cursor"
      style={{
        position: 'fixed',
        top: position.y - radius, // Center the circle/square
        left: position.x - radius,
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: isTransforming ? '0' : '50%', // Transform to square when near point
        backgroundColor: 'transparent', // Always transparent to create the stroke effect
        border: `5px solid ${isTransforming ? 'red' : 'white'}`, // Red stroke when transforming
        pointerEvents: 'none', // Ensure the cursor doesn't block interactions
        zIndex: 9999, // Make sure it appears above other elements
        animation: isTransforming ? 'scale-down 1.2s ease forwards' : 'none', // Apply scaling animation when entering the region
        transform: isTransforming ? 'rotate(360deg)' : 'none', // Perform one full spin
      }}
    />
  );
};

// Add CSS for the scaling animation
const styles = `
@keyframes scale-down {
  0% {
    transform: scale(1.6) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
  }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);

export default Cursor;
