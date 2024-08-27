import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

const Predict: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thermalFile, setThermalFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [annotatedThermalImage, setAnnotatedThermalImage] = useState<string | null>(null);
  const [annotatedVideo, setAnnotatedVideo] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showProcessedCard, setShowProcessedCard] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFileState: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileState(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, file: File | null, endpoint: string, setAnnotatedState: React.Dispatch<React.SetStateAction<string | null>>) => {
    event.preventDefault();
    if (!file) return;

    // Reset the processed image/video before submission
    setAnnotatedImage(null);
    setAnnotatedThermalImage(null);
    setAnnotatedVideo(null);

    setIsSubmitting(true);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result?.toString().split(',')[1];

      if (!base64String) {
        console.error('Failed to convert file to base64');
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64String }),
        });

        if (response.ok) {
          const responseData = await response.json();
          setAnnotatedState(responseData.Proc_img || responseData.Proc_video);
          setIsModalOpen(true);

          setTimeout(() => {
            setIsModalOpen(false);
            setTimeout(() => {
              setShowProcessedCard(true);
              setTimeout(() => {
                setIsSubmitted(true);
                setShouldAnimate(true);
              }, 100);
            }, 300);
          }, 1500);
        } else {
          console.error('Failed to upload file.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleCloseCard = () => {
    setShowProcessedCard(false);
    setShouldAnimate(false);
    setIsSubmitted(false);
    setFile(null);
    setThermalFile(null);
    setVideoFile(null);
    setIsSubmitting(false);
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
          {/* Container for Submission Cards */}
          <div className="flex space-x-8">

            {/* Thermal Image Submission Card */}
            {!showProcessedCard && (
              <div
                style={{
                  transition: 'transform 0.7s ease-in-out, opacity 0.7s ease-in-out',
                  transform: isSubmitting ? 'scale(0.25)' : 'scale(1)',
                  opacity: isSubmitting ? 0 : 1,
                }}
                className="relative"
              >
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-10 mb-24 shadow-[0_0_100px_rgba(255,255,255,0.5)]'>
                  <h1 className='text-4xl mb-4'>Imagem Térmica</h1>
                  <form onSubmit={(e) => handleSubmit(e, thermalFile, 'http://localhost:8000/api/image_processing/process_thermal', setAnnotatedThermalImage)} className="flex border-2 border-black rounded-xl items-center">
                    <label 
                      htmlFor="thermal-file-upload" 
                      className="bg-gray-700 text-white text-lg py-2 px-8 rounded-l-lg cursor-pointer hover:text-black duration-500">
                      Arquivo
                    </label>
                    <input
                      id="thermal-file-upload"
                      type='file'
                      accept='image/*'
                      onChange={(e) => handleFileChange(e, setThermalFile)}
                      className='hidden'
                    />
                    {thermalFile && (
                      <p className="text-black py-2 px-4">
                        <div className="text-lg">{thermalFile.name}</div>
                      </p>
                    )}
                    <button type='submit' className='bg-black text-white text-lg py-2 px-10 rounded-r-lg hover:text-gray-700 duration-500'>
                      Enviar
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Image Submission Card */}
            {!showProcessedCard && (
              <div
                style={{
                  transition: 'transform 0.7s ease-in-out, opacity 0.7s ease-in-out',
                  transform: isSubmitting ? 'scale(0.25)' : 'scale(1)',
                  opacity: isSubmitting ? 0 : 1,
                }}
                className="relative"
              >
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-10 mb-24 shadow-[0_0_100px_rgba(255,255,255,0.5)]'>
                  <h1 className='text-4xl mb-4'>Enviar Imagem</h1>
                  <form onSubmit={(e) => handleSubmit(e, file, 'http://localhost:8000/api/image_processing/process_image', setAnnotatedImage)} className="flex border-2 border-black rounded-xl items-center">
                    <label 
                      htmlFor="file-upload" 
                      className="bg-gray-700 text-white text-lg py-2 px-8 rounded-l-lg cursor-pointer hover:text-black duration-500">
                      Arquivo
                    </label>
                    <input
                      id="file-upload"
                      type='file'
                      accept='image/*'
                      onChange={(e) => handleFileChange(e, setFile)}
                      className='hidden'
                    />
                    {file && (
                      <p className="text-black py-2 px-4">
                        <div className="text-lg">{file.name}</div>
                      </p>
                    )}
                    <button type='submit' className='bg-black text-white text-lg py-2 px-10 rounded-r-lg hover:text-gray-700 duration-500'>
                      Enviar
                    </button>
                  </form>
                </div>
              </div>
            )}

            

            {/* Video Submission Card */}
            {!showProcessedCard && (
              <div
                style={{
                  transition: 'transform 0.7s ease-in-out, opacity 0.7s ease-in-out',
                  transform: isSubmitting ? 'scale(0.25)' : 'scale(1)',
                  opacity: isSubmitting ? 0 : 1,
                }}
                className="relative"
              >
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-10 mb-24 shadow-[0_0_100px_rgba(255,255,255,0.5)]'>
                  <h1 className='text-4xl mb-4'>Enviar Vídeo</h1>
                  <form onSubmit={(e) => handleSubmit(e, videoFile, 'http://localhost:8000/api/video_processing/process_video', setAnnotatedVideo)} className="flex border-2 border-black rounded-xl items-center">
                    <label 
                      htmlFor="video-file-upload" 
                      className="bg-gray-700 text-white text-lg py-2 px-8 rounded-l-lg cursor-pointer hover:text-black duration-500">
                      Arquivo
                    </label>
                    <input
                      id="video-file-upload"
                      type='file'
                      accept='video/*'
                      onChange={(e) => handleFileChange(e, setVideoFile)}
                      className='hidden'
                    />
                    {videoFile && (
                      <p className="text-black py-2 px-4">
                        <div className="text-lg">{videoFile.name}</div>
                      </p>
                    )}
                    <button type='submit' className='bg-black text-white text-lg py-2 px-10 rounded-r-lg hover:text-gray-700 duration-500'>
                      Enviar
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Processed Image/Video Card */}
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
                    onClick={handleCloseCard}
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
                  {annotatedImage && (
                    <img
                      src={`data:image/png;base64,${annotatedImage}`}
                      alt="Processed"
                      style={{
                        borderRadius: '30px',
                        width: '1800px',
                      }}
                      className="processed-image"
                    />
                  )}
                  {annotatedThermalImage && (
                    <img
                      src={`data:image/png;base64,${annotatedThermalImage}`}
                      alt="Processed Thermal"
                      style={{
                        borderRadius: '30px',
                        width: '1600px',
                      }}
                      className="processed-image"
                    />
                  )}
                  {annotatedVideo && (
                    <video
                      controls
                      style={{
                        borderRadius: '30px',
                        maxWidth: '100%',
                      }}
                      className="processed-image"
                    >
                      <source src={`data:video/mp4;base64,${annotatedVideo}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} message="Your file has been uploaded and processed successfully!" />
    </div>
  );
};

export default Predict;
