import React, { useEffect, useState, useCallback } from 'react';
import { FaTrash } from 'react-icons/fa';
import { baseURL } from '../../config';
import { FileService } from '../../services/FileService';
import './MyFiles.css';
import Unauth from '../../components/Unauth/Unauth';

export default function MyFiles() {
  const [pdfFiles, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const fetchFiles = useCallback(async () => {
    if (!isLoggedIn) {
      setFiles([]);
      setFileUrls({});
      return;
    }

    const fetched = await FileService.fetchFiles();
    const filteredFiles = fetched.filter(file =>
      file.filePath.toLowerCase().endsWith('.pdf')
    );

    setFiles(filteredFiles);

    const token = localStorage.getItem('token');
    const urls = {};

    await Promise.all(
      filteredFiles.map(async (file) => {
        try {
          const response = await fetch(`${baseURL}/api/physicalfile/${file.id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) throw new Error('Dosya alınamadı');

          const blob = await response.blob();
          urls[file.id] = URL.createObjectURL(blob);
        } catch (error) {
          console.error(`Dosya ${file.id} alınırken hata:`, error);
          urls[file.id] = null;
        }
      })
    );

    setFileUrls(urls);
  }, [isLoggedIn]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Unmount olurken blob URL'leri temizle
  useEffect(() => {
    return () => {
      Object.values(fileUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [fileUrls]);

  const onDelete = async (id) => {
    if (!isLoggedIn) return;
    await FileService.handleDelete(id);
    fetchFiles();
  };

  if (!isLoggedIn) {
    return <Unauth />;
  }

  return (
    <div>
      <h1>📄 Dosyalarım</h1>
      {pdfFiles.length > 0 ? (
        <ul className="pdf-list">
          {pdfFiles.map((file) => (
            <li key={file.id} className="pdf-item">
              <strong>{file.name}</strong> - {file.description}
              <button className="delete-btn" onClick={() => onDelete(file.id)}>
                <FaTrash />
              </button>
              <br />
              {fileUrls[file.id] ? (
                <a
                  href={fileUrls[file.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdf-link"
                >
                  PDF Aç
                </a>
              ) : (
                <span>Yükleniyor...</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-files-message">Henüz yüklenmiş PDF yok.</p>
      )}
    </div>
  );
}
