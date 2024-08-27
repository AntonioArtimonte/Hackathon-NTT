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
        <h1 style={{ textAlign: 'center', paddingTop: '35vh' }}>Additional Content</h1>
        <div className="flex justify-between w-full">

          <div className="flex flex-col justify-center w-1/2 h-full text-center items-center">
            <img src="/coruja3.svg" alt="" className='mb-36 scale-[1.55] hover:scale-[1.65] duration-500'/>
            <h1 className="text-white text-4xl font-bold">Veja o que seus olhos não veem</h1>
          </div>


          <div className="flex flex-col justify-center w-1/2 items-center">
            <h1 className="text-white w-3/4 text-justify leading-relaxed text-4xl font-bold">O Owl Sight não apenas vê — ele age, trazendo tecnologia e humanidade juntas em uma única força poderosa. Quando o caos ameaça dominar, nós enxergamos além, garantindo que a segurança esteja sempre à vista.</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;