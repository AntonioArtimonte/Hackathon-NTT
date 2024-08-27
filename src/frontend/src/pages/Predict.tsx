import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

const Predict: React.FC = () => {
  // Variáveis de estado para o processamento de imagem
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thermalImageFile, setThermalImageFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [annotatedThermalImage, setAnnotatedThermalImage] = useState<string | null>(null);
  const [showProcessedCard, setShowProcessedCard] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Variáveis de estado para o processamento de vídeo
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);

  // Manipulador de mudança de arquivo de imagem
  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImageFile(event.target.files[0]);
    }
  };

  // Manipulador de mudança de arquivo de imagem termal
  const handleThermalImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setThermalImageFile(event.target.files[0]);
    }
  };

  // Manipulador de mudança de arquivo de vídeo
  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
    }
  };

  // Manipulador de envio de imagem
  const handleImageSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile) return;

    setIsSubmitting(true); // Inicia a animação de encolhimento

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result?.toString().split(',')[1];

      if (!base64String) {
        console.error('Falha ao converter imagem para base64');
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
          setIsModalOpen(true); // Exibe o modal de sucesso

          // Fecha o modal após 1,5 segundos, depois exibe o cartão de imagem processada
          setTimeout(() => {
            setIsModalOpen(false);
            setTimeout(() => {
              setShowProcessedCard(true); // Exibe o cartão de imagem processada
              setTimeout(() => {
                setShouldAnimate(true); // Inicia a animação após a imagem aparecer
              }, 100); // Pequeno atraso para garantir que o cartão apareça antes da animação
            }, 300); // Pequeno atraso para permitir que o modal feche antes de exibir o cartão
          }, 1500);
        } else {
          console.error('Falha ao fazer upload da imagem.');
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    reader.readAsDataURL(imageFile);
  };

  // Manipulador de envio de imagem termal
  const handleThermalImageSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!thermalImageFile) return;

    setIsSubmitting(true); // Inicia a animação de encolhimento

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result?.toString().split(',')[1];

      if (!base64String) {
        console.error('Falha ao converter imagem termal para base64');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/image_processing/process_thermal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64String }),
        });

        if (response.ok) {
          const responseData = await response.json();
          setAnnotatedThermalImage(responseData.Proc_img);
          setIsModalOpen(true); // Exibe o modal de sucesso

          // Fecha o modal após 1,5 segundos, depois exibe o cartão de imagem processada
          setTimeout(() => {
            setIsModalOpen(false);
            setTimeout(() => {
              setShowProcessedCard(true); // Exibe o cartão de imagem processada
              setTimeout(() => {
                setShouldAnimate(true); // Inicia a animação após a imagem aparecer
              }, 100); // Pequeno atraso para garantir que o cartão apareça antes da animação
            }, 300); // Pequeno atraso para permitir que o modal feche antes de exibir o cartão
          }, 1500);
        } else {
          console.error('Falha ao fazer upload da imagem termal.');
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    reader.readAsDataURL(thermalImageFile);
  };

  // Manipulador de envio de vídeo
  const handleVideoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!videoFile) return;

    setIsSubmitting(true);
    setIsModalOpen(true);

    const formData = new FormData();
    formData.append('file', videoFile);

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
        console.error('Falha ao fazer upload do vídeo.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleCloseImage = () => {
    // Reseta os estados para voltar ao cartão de submissão
    setShowProcessedCard(false);
    setShouldAnimate(false);
    setIsSubmitting(false);
    setImageFile(null);
  };

  const handleCloseThermalImage = () => {
    // Reseta os estados para voltar ao cartão de submissão
    setShowProcessedCard(false);
    setShouldAnimate(false);
    setIsSubmitting(false);
    setThermalImageFile(null);
  };

  const handleCloseVideo = () => {
    setVideoFile(null);
    setProcessedVideo(null);
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Custom CSS for 3D rotation, hover effects, and shrinking animation */}
      <style>
        {`
          .carousel-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px; /* Space between the cards */
            perspective: 1000px;
            transition: transform 0.7s ease-in-out, opacity 0.7s ease-in-out;
            transform: ${isSubmitting ? 'scale(0.25)' : 'scale(1)'};
            opacity: ${isSubmitting ? 0 : 1};
          }

          .card {
            transition: transform 0.5s ease, box-shadow 0.5s ease;
            transform-style: preserve-3d;
            cursor: pointer;
          }

          /* 3D rotation for each card */
          .card:nth-child(1) {
            transform: rotateY(-15deg) translateZ(-50px);
          }

          .card:nth-child(2) {
            transform: rotateY(0deg) translateZ(0px); /* Center card */
          }

          .card:nth-child(3) {
            transform: rotateY(15deg) translateZ(-50px);
          }

          /* Enlarge, bring the hovered card to the front, and increase shadow glow */
          .card:hover {
            transform: scale(1.1) translateZ(50px);
            box-shadow: 0 20px 50px rgba(255, 255, 255, 0.8);
            z-index: 10;
          }

          .processed-image-container {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 20;
            width: 80%;
            height: auto;
            padding: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 20px;
          }

          .processed-image-container img {
            max-width: 100%;
            max-height: 80vh; /* Ensure image doesn't overflow vertically */
            border-radius: 20px;
          }

          .close-button {
            position: absolute;
            top: 10px;
            right: 20px;
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 3rem;
            font-weight: bold;
            color: white;
            z-index: 30;
          }
        `}
      </style>

      <Navbar />

      {/* Main container for the cards aligned in a line */}
      <div className="flex flex-grow justify-center items-center">
        <div className={`carousel-container ${isSubmitting ? 'scale-75' : ''} mb-24`}>
          {/* Enviar Vídeo Card */}
          <div className="card flex flex-col justify-center items-center bg-white rounded-2xl p-10 shadow-[0_0_100px_rgba(255,255,255,0.5)]">
            <h1 className="text-4xl mb-4">Enviar Vídeo</h1>
            <form onSubmit={handleVideoSubmit} className="flex border-2 border-black rounded-xl items-center">
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="hidden"
              />
              <label
                htmlFor="video-upload"
                className="bg-gray-700 text-white text-lg py-2 px-4 rounded-l-lg cursor-pointer hover:text-black duration-500"
              >
                Arquivo
              </label>
              {videoFile && <span className="ml-4 text-lg">{videoFile.name}</span>}
              <button type="submit" className="bg-black text-white text-lg py-2 px-10 rounded-r-lg hover:text-gray-700 duration-500">
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

          {/* Enviar Imagem Card */}
          <div className="card flex flex-col justify-center items-center bg-white rounded-2xl p-10 shadow-[0_0_100px_rgba(255,255,255,0.5)]">
            <h1 className="text-4xl mb-4">Enviar Imagem</h1>
            <form onSubmit={handleImageSubmit} className="flex border-2 border-black rounded-xl items-center">
              <label 
                htmlFor="image-upload" 
                className="bg-gray-700 text-white text-lg py-2 px-8 rounded-l-lg cursor-pointer hover:text-black duration-500">
                Arquivo
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
              {imageFile && (
                <p className="text-black py-2 px-4">
                  <div className="text-lg">{imageFile.name}</div>
                </p>
              )}
              <button type="submit" className="bg-black text-white text-lg py-2 px-10 rounded-r-lg hover:text-gray-700 duration-500">
                Enviar
              </button>
            </form>
          </div>

          {/* Imagem Termal Card */}
          <div className="card flex flex-col justify-center items-center bg-white rounded-2xl p-10 shadow-[0_0_100px_rgba(255,255,255,0.5)]">
            <h1 className="text-4xl mb-4">Imagem Termal</h1>
            <form onSubmit={handleThermalImageSubmit} className="flex border-2 border-black rounded-xl items-center">
              <label 
                htmlFor="thermal-image-upload" 
                className="bg-gray-700 text-white text-lg py-2 px-8 rounded-l-lg cursor-pointer hover:text-black duration-500">
                Arquivo
              </label>
              <input
                id="thermal-image-upload"
                type="file"
                accept="image/*"
                onChange={handleThermalImageFileChange}
                className="hidden"
              />
              {thermalImageFile && (
                <p className="text-black py-2 px-4">
                  <div className="text-lg">{thermalImageFile.name}</div>
                </p>
              )}
              <button type="submit" className="bg-black text-white text-lg py-2 px-10 rounded-r-lg hover:text-gray-700 duration-500">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Processed Image Card */}
      {showProcessedCard && (
        <div className="processed-image-container">
          <button
            onClick={handleCloseImage}
            className="close-button"
          >
            &times;
          </button>
          {annotatedImage && (
            <img
              src={`data:image/png;base64,${annotatedImage}`}
              alt="Processed"
              className="processed-image"
            />
          )}
        </div>
      )}

      {/* Success Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} message="Seu arquivo foi enviado e processado com sucesso!" />
    </div>
  );
};

export default Predict;
