import React, { useState } from 'react';
import Navbar from '../components/Navbar'

const Predict: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
        const response = await fetch('http://localhost:8000/api/image_processing/process_image', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Image uploaded successfully!');
        } else {
            console.error('Failed to upload image.');
        }
        } catch (error) {
        console.error('Error:', error);
        }
    };




    return (
        <div className='h-screen bg-black flex flex-col'>
        <Navbar />
        <div className="flex flex-grow justify-center gap-x-8 items-center">
            <div className='flex flex-col justify-center items-center rounded-2xl p-44 bg-white'>
                <h1 className='text-4xl mb-4'>Enviar Imagem</h1>
                <form onSubmit={handleSubmit} className="flex border-2 border-black rounded-xl items-center">
                    <label 
                    htmlFor="file-upload" 
                    className="bg-gray-700 text-white text-lg py-2 px-8 rounded-l-lg cursor-pointer">
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
                    <p className="text-black py-2 px-4">
                        <div className="text-lg">{file.name}</div>
                    </p>
                    )}
                    <button type='submit' className='bg-black text-white text-lg py-2 px-10 rounded-r-lg'>
                    Enviar
                    </button>
                </form>
            </div>
            <div className='flex flex-col justify-center items-center rounded-2xl p-44 bg-white'>
            <h1 className='text-4xl'>Hello Tonguinho</h1>
            <p>Lorem Ipsum Sit Amet Dolor</p>
            </div>
        </div>
        </div>

    
  )
}

export default Predict