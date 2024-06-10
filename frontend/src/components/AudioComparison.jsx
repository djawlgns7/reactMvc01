import React, { useState } from 'react';
import axios from 'axios';

function AudioComparison() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/audio/compare', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error comparing audio files:', error);
    }
  };

  return (
    <div>
      <h1>Audio Comparison</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Compare</button>
      {result && (
        <div>
          <h2>Comparison Result</h2>
          <p>Distance: {result.distance}</p>
          <p>Similarity: {result.similarity.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default AudioComparison;
