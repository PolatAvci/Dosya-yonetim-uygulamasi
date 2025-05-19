import React, { useState } from 'react';
import './AddFile.css';
import { FileService } from '../../services/FileService.js';

export default function AddFile({ getFiles }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError('');
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    if (!description.trim()) {
      setError('Açıklama zorunludur.');
      return;
    }

    await FileService.handleUpload(selectedFile, description);
    
    if (getFiles) {
      await getFiles();
    }

    // Formu sıfırla
    setFileInputKey(Date.now());
    setDescription('');
    setSelectedFile(null);
    setError('');
    setSuccess(true);

    
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className='container'>
      <h1>Dosya Yükle</h1>

      <input
        key={fileInputKey}
        type="file"
        className='input'
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg"
      />

      <input
        type="text"
        className='input'
        placeholder="Açıklama"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setError('');
        }}
      />

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">✅ Dosya başarıyla yüklendi.</p>}

      <button
        className='button'
        onClick={uploadFile}
        disabled={!selectedFile || !description.trim()}
      >
        Yükle
      </button>
    </div>
  );
}
