import React, { useEffect, useState } from 'react';
import Grid from '../components/Grid';
import Navbar from '../components/Navbar';
import { Container } from '../components/Container';
import '../components/grid.css'; // Import the scoped CSS for the gallery

interface ApiData {
  ID: string;
  LAT: string;
  LONG: string;
  Proc_img: string; // Base64 image
  Survivors: string;
  Peso: number;
  Time: string;
}

export default function Gallery() {
  const [data, setData] = useState<ApiData[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/crud/read')
      .then(response => response.json())
      .then(data => setData(data)) // Assuming `data` is an array of objects
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Map the fetched data to Container components
  const items = data.map((item) => (
    <Container key={item.ID} image={item.Proc_img} />
  ));

  return (
    <div className="gallery-container">
      <Navbar />
      <div className="flex-grow">
        <Grid items={items} />
      </div>
    </div>
  );
}
