import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddFile.css';
import { FileService } from '../../services/FileService.js';

const baseURL = 'http://localhost:5000';

export default function AddFile({ getFiles }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    await FileService.handleUpload(selectedFile, description);
    await getFiles(); // listeyi güncelle
    setFileInputKey(Date.now());
    setDescription('');
    setSelectedFile(null);
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
        onChange={e => setDescription(e.target.value)}
      />
      <button className='button' onClick={uploadFile} disabled={!selectedFile}>
        Yükle
      </button>
    </div>
  );
}
