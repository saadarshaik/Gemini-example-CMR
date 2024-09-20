import React, { useState } from 'react';

function UploadPoster() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // To show loading state

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      console.log('No file selected');
      alert('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('poster', selectedFile);
    formData.append('description', description);

    setIsSubmitting(true);  // Show loading

    try {
      console.log('Sending data to backend...');
      const response = await fetch('http://localhost:5000/api/posters', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload');
      }

      const data = await response.json();
      console.log('Response from backend:', data);
      alert('Poster uploaded successfully!');

      // Reset form after successful upload
      setSelectedFile(null);
      setDescription('');
    } catch (err) {
      console.error('Error uploading poster:', err);
      alert('Error uploading poster. Check console for more details.');
    } finally {
      setIsSubmitting(false);  // Hide loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} required />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description (optional)"
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading...' : 'Upload Poster'}
      </button>
    </form>
  );
}

export default UploadPoster;
