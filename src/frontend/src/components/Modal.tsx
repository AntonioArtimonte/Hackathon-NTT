import React, { useEffect, useState } from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 2000); // Delay to allow fade-out animation
    }
  }, [show]);

  if (!isVisible && !show) return null;

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transition: 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 0,
        position: 'fixed',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: show ? 'translateY(0)' : 'translateY(-20)',
          backgroundColor: 'white',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          borderRadius: '16px',
          textAlign: 'center',
          zIndex: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl mb-8">Imagem em processamento</h2>
        <img src="/coruja_preta.svg" alt="Processing" />
      </div>
    </div>
  );
};

export default Modal;
