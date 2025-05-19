import React, { useState, useEffect, useCallback } from 'react';
import './MyImagesPage.css';
import { FaTrash } from 'react-icons/fa';
import { baseURL } from '../../config';
import { FileService } from '../../services/FileService';
import Unauth from '../../components/Unauth/Unauth';

export default function MyImages() {
  const [imageFiles, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const fetchFiles = useCallback(async () => {
    if (!isLoggedIn) {
      setFiles([]);
      return;
    }

    const fetched = await FileService.fetchFiles();
    const imageExtensions = ['jpeg', 'png', 'jpg'];
    const filteredFiles = fetched.filter((file) =>
      imageExtensions.includes(file.filePath.split('.').pop().toLowerCase())
    );
    setFiles(filteredFiles);

    // Her dosya için API'den blob indirip URL oluştur
    const token = localStorage.getItem('token');
    const urls = {};

    await Promise.all(
      filteredFiles.map(async (file) => {
        try {
          const response = await fetch(`${baseURL}/api/physicalfile/${file.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Response:', response);

          if (!response.ok) throw new Error('Dosya alınamadı');

          const blob = await response.blob();
          urls[file.id] = URL.createObjectURL(blob);
        } catch (error) {
          console.error(`Dosya ${file.id} alınırken hata:`, error);
          urls[file.id] = null; // veya placeholder image url
        }
      })
    );

    setImageUrls(urls);
  }, [isLoggedIn]);

  useEffect(() => {
    fetchFiles();
    // Cleanup URL.createObjectURL memory leak önlemek için
    return () => {
      Object.values(imageUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [fetchFiles, imageUrls]);

  const onDelete = async (id) => {
    await FileService.handleDelete(id);
    fetchFiles();
  };

  if (!isLoggedIn) {
    return <Unauth />;
  }

  return (
    <div>
      <h1>📷 Görsellerim</h1>
      {imageFiles.length > 0 ? (
        <ul className="image-list">
          {imageFiles.map((file) => (
            <li key={file.id} className="card">
              <button className="delete-btn" onClick={() => onDelete(file.id)}>
                <FaTrash />
              </button>
              {imageUrls[file.id] ? (
                <a href={imageUrls[file.id]} target="_blank" rel="noreferrer">
                  <img src={imageUrls[file.id]} alt={file.name} />
                </a>
              ) : (
                <p>Yükleniyor...</p>
              )}
              <a href={`/images/${file.id}`} rel="noreferrer">
                <strong>{file.name}</strong>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className='no-files-message'>Henüz yüklenmiş görsel yok.</p>
      )}
    </div>
  );
}
