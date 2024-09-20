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

  const styles = {
    feedContainer: {
      maxWidth: '1000px',
      margin: '50px auto',
    },
    title: {
      fontSize: '28px',
      textAlign: 'center',
      marginBottom: '30px',
      fontFamily: 'Roboto, sans-serif',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
    },
    card: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
    },
    info: {
      padding: '15px',
    },
    cardTitle: {
      fontSize: '18px',
      marginBottom: '10px',
    },
    description: {
      fontSize: '14px',
      marginBottom: '10px',
    },
    category: {
      fontSize: '12px',
      color: '#555',
    },
  };

  return (
    <div style={styles.feedContainer}>
      <h2 style={styles.title}>Poster Feed</h2>
      <div style={styles.grid}>
        {posters.map((poster) => (
          <div key={poster._id} style={styles.card}>
            <img src={poster.imageUrl} alt={poster.title} style={styles.image} />
            <div style={styles.info}>
              <h3 style={styles.cardTitle}>{poster.title}</h3>
              <p style={styles.description}>{poster.description}</p>
              <span style={styles.category}>Category: {poster.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PosterFeed;
