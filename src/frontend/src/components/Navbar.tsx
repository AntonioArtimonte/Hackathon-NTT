import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    return (
    <div className="flex items-center flex-row justify-center gap-x-12 py-8">
      <img
        src="/coruja.svg"
        alt=""
        className="w-1/12 p-6 fill-gray-700 cursor-pointer"
      />
      <div>
        <h1 className="text-white text-2xl font-normal hover:text-gray-700 duration-500 cursor-pointer">
          Prever
        </h1>
      </div>
      <div>
        <h1 className="text-white text-2xl font-normal hover:text-gray-700 duration-500 cursor-pointer">
          Gerar Dados
        </h1>
      </div>
      <div>
        <h1 className="text-white text-2xl font-normal hover:text-gray-700 duration-500 cursor-pointer">
          Gerar Rotas
        </h1>
      </div>
      <div>
        <h1 className="text-white text-2xl font-normal hover:text-gray-700 duration-500 cursor-pointer" onClick={()=>navigate("/detect-sound")}>
          Detectar Sons
        </h1>
      </div>
    </div>
  );
}
