import React from 'react'

export default function App() {
  return (
    <div className="mx-auto flex justify-between flex-col w-full h-screen bg-black ">
      
      <div className='flex items-center flex-row justify-center gap-x-12 py-8'>
        <img src="/coruja.svg" alt="" className='w-1/12 p-6 fill-gray-700 cursor-pointer'/>
        <div>
          <h1 className="text-white text-2xl font-normal hover:text-gray-700 duration-500 cursor-pointer">Prever</h1>
        </div>
        <div>
          <h1 className="text-white text-2xl font-normal hover:text-gray-700 duration-500 cursor-pointer">Gerar Dados</h1>
        </div>
        <div>
          <h1 className="text-white text-2xl font-normal hover:text-gray-700 duration-500 cursor-pointer">Gerar Rotas</h1>
        </div>
        <div>
          <h1 className="text-white text-2xl font-normal hover:text-gray-700 duration-500 cursor-pointer">Detectar Sons</h1>
        </div>
      </div>
      

      <div className="flex justify-center h-full items-center">
        <h1 className="text-white text-4xl font-normal">RogersAI</h1>
      </div>
    </div>
  )
}
