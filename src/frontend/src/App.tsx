import React from 'react'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className='h-screen bg-black flex flex-col'>
      <Navbar />
      <div className="flex flex-grow justify-center gap-x-8 items-center">
        <div className='flex flex-col justify-center items-center rounded-2xl p-44 bg-white'>
          <h1 className='text-4xl'>Hello Tonguinho</h1>
          <p>Lorem Ipsum Sit Amet Dolor</p>
        </div>
        <div className='flex flex-col justify-center items-center rounded-2xl p-44 bg-white'>
          <h1 className='text-4xl'>Hello Tonguinho</h1>
          <p>Lorem Ipsum Sit Amet Dolor</p>
        </div>
      </div>
    </div>

    
  )
}
