import React from 'react';

const LogoAndPhrase: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '15%',
        left: '9%',
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
          maxWidth: '300px', // Adjust size as needed
          marginBottom: '20px',
        }}
      />
      <p
        style={{
          fontSize: '24px', // Adjust text size as needed
          margin: 0,
          fontWeight: 'bold',
        }}
      >
        O Importante é Competir
      </p>
    </div>
  );
};

export default LogoAndPhrase;
