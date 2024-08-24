import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScratchOffEffect from '../components/ScratchOffEffect';

const LandingPage: React.FC = () => {
  const [disableCursor, setDisableCursor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure the page starts at the top on reload with a slight delay
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    setTimeout(scrollToTop, 100); // 100ms delay to ensure the page fully loads

    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        // User scrolled down, scroll to the bottom
        setDisableCursor(true); // Disable cursor transformation
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else if (e.deltaY < 0 && window.scrollY === 0) {
        // User scrolled up at the top of the page, re-enable cursor transformation
        setDisableCursor(false);
      }
    };

    window.addEventListener('wheel', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <div
      style={{
        overflowX: 'hidden', // Hide horizontal overflow to prevent x scrollbar
      }}
    >
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {/* The ScratchOffEffect component with your interactive effect */}
      <ScratchOffEffect disableCursor={disableCursor} />

      {/* Add a full-screen size black background section */}

      {/* You can add more sections or content below */}
      <div
        style={{
          width: '100vw',
          height: '100vh', // Example for extra content
          backgroundColor: 'black', // Light gray background
        }}
      >
        <h1 style={{ textAlign: 'center', paddingTop: '20vh' }}>Additional Content</h1>
        <h1 className='flex flex-col text-center justify-center items-center gap-y-20 text-white text-7xl ' onClick={() => navigate('/main')}>
          <img src="/coruja.svg" alt="" className='w-1/3 hover:scale-105 duration-1000 cursor-pointer'/>
          Veja o que seu olhos não veem
        </h1>
      </div>
    </div>
  );
};

export default LandingPage;
