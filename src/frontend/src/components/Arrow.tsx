import React from 'react';

const ScrollToBottomArrow: React.FC = () => {

    const bounceAnimation = {
        animation: 'slowBounce 2s infinite',
    };

    const keyframes = `
    @keyframes slowBounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }`;

    return (
        <button
            className="absolute inset-x-0 bottom-16 z-10 flex justify-center mb-10"
            aria-label="Scroll to bottom"
        >
            <style>{keyframes}</style>
            <img src="./seta.png" alt="Scroll Down" className="w-16 h-auto" style={bounceAnimation} />
        </button>
    );
};

export default ScrollToBottomArrow;
