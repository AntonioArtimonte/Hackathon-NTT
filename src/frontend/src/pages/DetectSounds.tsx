import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

import { Buffer } from "buffer";

interface AudioProcessingResponse {
  ID: number;
  LAT: number;
  LONG: number;
  Survivors: string;
  Peso: number;
  Time: Date;
}

const DetectSounds: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState(false);
  const [people, setPeople] = useState(false);
  const [audioProcessingResponse, setAudioProcessingResponse] =
    useState<AudioProcessingResponse | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;
    const bufferFile = await file.arrayBuffer();
    const fileBase64 = Buffer.from(bufferFile).toString("base64"); // Buffer is now defined
    try {
      const response = await fetch(
        "http://localhost:8000/api/audio_processing/analyze_audio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Add headers to specify JSON payload
          },
          body: JSON.stringify({ audio_base64: fileBase64 }),
        }
      );
      if (response.ok) {
        const responseData = await response.json(); // Store the response body in a variable
        console.log(responseData); // Log the response body

        setResult(true);

        if ("people" in responseData) {
          console.log("helo");
          setPeople(true);
        } else {
          console.log("godot");
          setAudioProcessingResponse(responseData);
        }
      } else {
        console.error("Failed to upload audio.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      <Navbar />

      <div className="flex flex-grow justify-center items-center">
        <div className="relative w-full h-full flex justify-center items-center">
          {!result && (
            <div className="flex flex-col justify-center items-center bg-white rounded-2xl p-10 mb-24 shadow-[0_0_100px_rgba(255,255,255,0.5)]'">
              <h1 className="text-4xl mb-4 font-bold">Envie o áudio</h1>
              <form
                onSubmit={handleSubmit}
                className="flex border-2 border-black rounded-xl items-center"
              >
                <label
                  htmlFor="file-upload"
                  className="bg-gray-700 text-white text-lg py-2 px-4 rounded-l-lg cursor-pointer"
                >
                  Escolher Arquivo
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="audio/wav"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {file && (
                  <p className="text-black py-2 px-4">
                    <div className="text-lg">{file.name}</div>
                  </p>
                )}
                <button
                  type="submit"
                  className="bg-black text-white text-lg py-2 px-8 rounded-r-lg"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
          {result && (
            <div className="flex flex-col justify-center items-center bg-white rounded-2xl p-10 mb-24 shadow-[0_0_100px_rgba(255,255,255,0.5)]'">
              {people ? (
                <h1 className="text-4xl mb-4 font-semibold">
                  Não foi identificado nenhuma pessoa
                </h1>
              ) : (
                <div>
                  <h1 className="text-4xl mb-4">
                    Uma pessoa foi encontrada com{" "}
                    {audioProcessingResponse?.Peso}% de certeza{" "}
                  </h1>
                  <h2 className="text-xl mb-4">
                    {" "}
                    Latitude: {audioProcessingResponse?.LAT}º
                  </h2>
                  <h2 className="text-xl mb-4">
                    {" "}
                    Longitude: {audioProcessingResponse?.LONG}º
                  </h2>
                  <h2 className="text-xl mb-4">
                    {" "}
                    Horário: {audioProcessingResponse?.Time?.toString()}
                  </h2>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetectSounds;
