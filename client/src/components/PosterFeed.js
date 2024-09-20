import React, { useEffect, useState } from 'react';

function PosterFeed() {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    async function fetchPosters() {
      try {
        const response = await fetch('http://localhost:5000/api/posters');
        const data = await response.json();
        setPosters(data);
      } catch (err) {
        console.error('Error fetching posters:', err);
      }
    }
    fetchPosters();
  }, []);

  return (
    <div>
      {posters.map((poster) => (
        <div key={poster._id}>
          <img src={poster.imageUrl} alt={poster.title} width="300" />
          <h3>{poster.title}</h3>
          <p>{poster.description}</p>
        </div>
      ))}
    </div>
  );
}

export default PosterFeed;
