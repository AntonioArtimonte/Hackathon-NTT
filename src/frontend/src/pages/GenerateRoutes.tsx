import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../components/Navbar";

// Fix for marker icons not showing correctly in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
});

const GenerateRoutes: React.FC = () => {
    const [coordinates, setCoordinates] = useState<[number, number][]>([]);
    const [showMap, setShowMap] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Submitted');

        setIsFadingOut(true);

        try {
            const response = await fetch("http://localhost:8000/api/route_processing/routes", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Received data:", data);

                const routesString = data.routes;
                if (typeof routesString === "string") {
                    const coordArray = routesString.split(";").map((coord: string) => {
                        const [lat, long] = coord.split(",");
                        return [parseFloat(lat), parseFloat(long)] as [number, number];
                    });

                    setCoordinates(coordArray);

                    setTimeout(() => {
                        setIsFadingOut(false);
                        setShowMap(true);
                    }, 500); // Wait for the fade-out animation to complete
                    console.log("Route generated successfully!");
                } else {
                    console.error("Unexpected format for 'routes':", routesString);
                    setIsFadingOut(false);
                }
            } else {
                console.error("Failed to generate route.");
                setIsFadingOut(false);
            }
        } catch (error) {
            console.error("Error:", error);
            setIsFadingOut(false);
        }
    };

    const handleCloseMap = () => {
        setIsFadingOut(true); // Start fading out the map
        setTimeout(() => {
            setShowMap(false);
            setIsFadingOut(false); // Reset fade-out state after animation
        }, 500); // Wait for the map fade-out animation to complete
    };

    return (
        <div className='h-screen bg-black flex flex-col'>
            <Navbar />
            <div className='flex-grow flex justify-center items-center'>
                {!showMap && (
                    <div
                        className={`absolute transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
                    >
                        <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-10 mb-24 shadow-[0_0_100px_rgba(255,255,255,0.5)] w-6/7'>
                            <h1 className='text-4xl mb-4 text-center'>Analisar melhor rota</h1>
                            <form onSubmit={handleSubmit} className="flex items-center">
                                <button type='submit' className='bg-black text-white text-lg py-2 px-10 rounded-xl hover:text-gray-700 duration-500'>
                                    Prever
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {showMap && (
                    <div
                        className={`absolute transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'} w-4/5`}
                    >
                        <div className='relative flex flex-col justify-center items-center bg-white rounded-2xl p-10 mb-24 shadow-[0_0_100px_rgba(255,255,255,0.5)] w-full group'>
                            <button
                                onClick={handleCloseMap}
                                className="absolute top-4 right-4 text-black text-3xl font-bold hover:bg-gray-300 p-2 rounded-full"
                            >
                                &times;
                            </button>
                            <h1 className="text-4xl mb-4 text-center">Melhor rota sugerida</h1>
                            <div className="w-full h-auto">
                                <MapContainer center={coordinates[0]} zoom={13} className="h-96 w-full rounded-xl">
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    />  
                                    <Polyline positions={coordinates} color="blue" />
                                    {coordinates.map((coord, index) => (
                                        <Marker position={coord} key={index}>
                                            <Popup>Stop {index + 1}</Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateRoutes;
