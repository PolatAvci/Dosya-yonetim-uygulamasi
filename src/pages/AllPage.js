// FilesPage.js
import React, { useState, useEffect } from 'react';
import AddFile from '../components/AddFile/AddFile';
import FileList from '../components/FileList/FileList';
import { FileService } from '../services/FileService';
import { useCallback } from 'react';
import Unauth from '../components/Unauth/Unauth';

export function AllPage() {
  const [files, setFiles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

 const fetchFiles = useCallback(async () => {
    if (!isLoggedIn) {
      setFiles([]);
      return;
    }

    const fetched = await FileService.fetchFiles();
    setFiles(fetched);
  }, [isLoggedIn]);

  const deleteFile = async (fileId) => {
    await FileService.handleDelete(fileId);
    fetchFiles(); 
  };

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  if (!isLoggedIn) {
    return <Unauth />;
  }

  return (
    <div>
      <AddFile getFiles={fetchFiles} />
      <FileList files={files} onDelete={deleteFile} />
    </div>
  );
}
