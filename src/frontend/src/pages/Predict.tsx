import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

const PredictVideo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showProcessedCard, setShowProcessedCard] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsSubmitting(true); // Start shrinking animation

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result?.toString().split(',')[1];

      if (!base64String) {
        console.error('Failed to convert image to base64');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/image_processing/process_image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64String }),
        });

        if (response.ok) {
          const responseData = await response.json();
          setAnnotatedImage(responseData.Proc_img);
          setIsModalOpen(true); // Show the success modal

          // Close the modal after 1.5 seconds, then show the processed image card
          setTimeout(() => {
            setIsModalOpen(false);
            setTimeout(() => {
              setShowProcessedCard(true); // Show the processed image card
              setTimeout(() => {
                setIsSubmitted(true); // Hide the submission card
                setShouldAnimate(true); // Start the animation after the image appears
              }, 100); // Small delay to ensure the card appears before the animation
            }, 300); // Slight delay to allow the modal to close before showing the card
          }, 1500);
        } else {
          console.error('Failed to upload image.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleCloseImage = () => {
    // Reset the states to go back to the submission card
    setShowProcessedCard(false);
    setShouldAnimate(false);
    setIsSubmitted(false);
    setFile(null);
    setIsSubmitting(false); // Ensure the submit card is reset
  };

  return (
    <div className='h-screen bg-black flex flex-col'>
      <style>
        {`
          .processed-image {
            transition: opacity 0.5s ease-in-out;
          }

          .close-button:hover + .processed-image {
            opacity: 0.5;
            color: white;
          }
        `}
      </style>
      <Navbar />
      <div className="flex flex-grow justify-center items-center">
        <div className="relative w-full h-full flex justify-center items-center">
          {/* Submission Card */}
          {!showProcessedCard && (
            <div
              style={{
                transition: 'transform 0.7s ease-in-out, opacity 0.7s ease-in-out',
                transform: isSubmitting ? 'scale(0.25)' : 'scale(1)',
                opacity: isSubmitting ? 0 : 1,
              }}
              className="absolute"
            >
              <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-10 mb-24 shadow-[0_0_100px_rgba(255,255,255,0.5)]'>
                <h1 className='text-4xl mb-4'>Enviar Imagem</h1>
                <form onSubmit={handleSubmit} className="flex border-2 border-black rounded-xl items-center">
                  <label 
                    htmlFor="file-upload" 
                    className="bg-gray-700 text-white text-lg py-2 px-8 rounded-l-lg cursor-pointer hover:text-black duration-500">
                    Arquivo
                  </label>
                  <input
                    id="file-upload"
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='hidden'
                  />
                  {file && (
                    <div className="text-black py-2 px-4">
                      {file.name}
                    </div>
                  )}
                  <button type='submit' className='bg-black text-white text-lg py-2 px-10 rounded-r-lg hover:text-gray-700 duration-500'>
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Processed Image Card */}
          {showProcessedCard && (
            <div
              style={{
                transition: 'transform 0.7s ease-in-out, opacity 0.7s ease-in-out',
                transform: shouldAnimate ? 'scale(0.55)' : 'scale(0.25)',
                opacity: shouldAnimate ? 1 : 0,
                zIndex: shouldAnimate ? 20 : 10,
              }}
              className="absolute mb-10 rounded-xl"
            >
              <div className='flex flex-col justify-center items-center rounded-[30px] shadow-[0_0_100px_rgba(255,255,255,0.5)]'>
                <div style={{ position: 'relative', display: 'inline-block'}}>
                  <button
                    onClick={handleCloseImage}
                    className="close-button"
                    style={{
                      position: 'absolute',
                      top: '0px',
                      right: '20px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      color: 'black',
                      zIndex: 30,
                    }}
                  >
                    &times;
                  </button>
                  {annotatedImage ? (
                    <img
                      src={`data:image/png;base64,${annotatedImage}`}
                      alt="Processed"
                      style={{
                        borderRadius: '30px',
                        maxWidth: '100%',
                      }}
                      className="processed-image"
                    />
                  ) : (
                    <p>No image processed yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} message="Your image has been uploaded and processed successfully!" />
    </div>
  );
};

export default PredictVideo;
