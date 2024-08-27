import React from 'react';

const LogoAndPhrase: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '17%',
        left: '11%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: '#ffffff', // Text color, adjust as needed
        zIndex: 9998, // Ensure it's above the canvas but below the cursor
      }}
    >
      <img
        src="/coruja.svg" // Replace with your logo path
        alt="Logo"
        style={{
          width: '300px', // Adjust size as needed
          marginBottom: '20px',
        }}
      />
    </div>
  );
};

export default LogoAndPhrase;
