import React, { useState } from 'react';

function UploadPoster() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('poster', selectedFile);

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/posters', {
        method: 'POST',
        body: formData,
      });

      // Log the full response object
      console.log('Response:', response);

      if (!response.ok) {
        throw new Error('Failed to upload');
      }

      const data = await response.json();
      console.log('Response Data:', data);

      if (data.message === 'Poster uploaded successfully') {
        alert('Poster uploaded successfully!');
      } else {
        throw new Error('Unexpected response format');
      }

      setSelectedFile(null);
    } catch (err) {
      console.error('Error uploading poster:', err);
      alert('Error uploading poster. Check console for more details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      textAlign: 'center',
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
      fontFamily: 'Roboto, sans-serif',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    fileLabel: {
      padding: '10px',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    fileInput: {
      display: 'none',
    },
    button: {
      padding: '10px',
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Poster</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.fileLabel}>
          {selectedFile ? selectedFile.name : 'Select an Image'}
          <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
        </label>
        <button
          type="submit"
          style={isSubmitting ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Uploading...' : 'Upload Poster'}
        </button>
      </form>
    </div>
  );
}

export default UploadPoster;
