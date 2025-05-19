import React, { useState, useEffect, useCallback } from 'react';
import AddFile from '../components/AddFile/AddFile';
import Unauth from '../components/Unauth/Unauth';
import { FileService } from '../services/FileService';
import { baseURL } from '../config';
import FileList from '../components/FileList/FileList';

export function AllPage() {
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kullanıcı giriş durumunu kontrol et
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Dosyaları API'den çek ve blob URL'lerini oluştur
  const fetchFiles = useCallback(async () => {
    if (!isLoggedIn) {
      setFiles([]);
      setFileUrls({});
      return;
    }

    const fetched = await FileService.fetchFiles();

    const allowedExtensions = ['jpeg', 'png', 'jpg', 'pdf'];
    const filteredFiles = fetched.filter(file =>
      allowedExtensions.includes(file.filePath.split('.').pop().toLowerCase())
    );

    setFiles(filteredFiles);

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

  // Sadece fetchFiles bağımlı, fileUrls bağımlılığını kaldırdık
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Component unmount veya fileUrls değiştiğinde önceki blob URL'lerini temizle
  useEffect(() => {
    return () => {
      Object.values(fileUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [fileUrls]);

  const deleteFile = async (fileId) => {
    await FileService.handleDelete(fileId);
    fetchFiles();
  };

  if (!isLoggedIn) {
    return <Unauth />;
  }

  return (
    <div>
      <AddFile getFiles={fetchFiles} />
      {files.length > 0 ? (
        <FileList files={files} fileUrls={fileUrls} onDelete={deleteFile} />
      ) : (
        <p className='no-files-message' >Henüz yüklenmiş görsel veya pdf yok.</p>
      )}
    </div>
  );
}
