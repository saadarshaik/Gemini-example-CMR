import React from 'react';
import UploadPoster from './components/UploadPoster';
import PosterFeed from './components/PosterFeed';

function App() {
  return (
    <div>
      <h1>Poster Upload and Feed</h1>
      <UploadPoster />
      <PosterFeed />
    </div>
  );
}

export default App;
