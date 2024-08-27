import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

const PredictVideo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsSubmitting(true); 
    setIsModalOpen(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/video_processing/process_video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        setProcessedVideo(videoUrl);

        setTimeout(() => {
          setIsModalOpen(false);
          setIsSubmitting(false);
        }, 1500);
      } else {
        console.error('Failed to upload video.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseVideo = () => {
    setFile(null);
    setProcessedVideo(null);
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  return (
    <div className='h-screen bg-black flex flex-col'>
      <Navbar />
      <div className="flex flex-grow justify-center items-center">
        <div className="relative w-full h-full flex justify-center items-center">
          <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-10 mb-24 shadow-[0_0_100px_rgba(255,255,255,0.5)]'>
                <h1 className='text-4xl mb-4'>Enviar Vídeo</h1>
                <form onSubmit={handleSubmit} className="flex border-2 border-black rounded-xl items-center">
                <input
                  id="file-upload"
                  type='file'
                  accept='video/*'
                  onChange={handleFileChange}
                  className='hidden'
                />
                <label 
                  htmlFor="file-upload"
                  className="bg-gray-700 text-white text-lg py-2 px-4 rounded-l-lg cursor-pointer hover:text-black duration-500">
                  Escolher Vídeo
                </label>
                {file && <span className="ml-4 text-lg">{file.name}</span>}
                <button type='submit' className='bg-black text-white text-lg py-2 px-14 rounded-r-lg hover:text-gray-700 duration-500'>
                  Enviar
                </button>
              </form>
              {processedVideo && (
                  <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full">
                  <video
                    controls
                    src={processedVideo}
                    style={{ width: '50%', height: 'auto' }}
                    className="processed-video"
                  />
                  <button
                    onClick={handleCloseVideo}
                    className="mt-4 bg-red-500 text-white py-2 px-6 rounded-lg"
                    style={{ position: 'absolute', top: '90%', transform: 'translateX(-50%)', left: '50%' }}
                  >
                    Fechar Vídeo
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} message="Your image has been uploaded and processed successfully!"/>
    </div>
  );
};

export default PredictVideo;