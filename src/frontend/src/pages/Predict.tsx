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
        const response = await fetch('http://localhost:8000/upload', {
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
                <h1 className='text-4xl mb-4'>Upload Image</h1>
                <form onSubmit={handleSubmit}>
                    <input
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='mb-4'
                    />
                    <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded'>
                    Submit
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