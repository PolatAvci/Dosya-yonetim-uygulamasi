// FilesPage.js
import React, { useState, useEffect } from 'react';
import AddFile from '../components/AddFile/AddFile';
import FileList from '../components/FileList/FileList';
import { FileService } from '../services/FileService';

export function AllPage() {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const fetched = await FileService.fetchFiles();
    setFiles(fetched);
  };

  const deleteFile = async (fileId) => {
    await FileService.handleDelete(fileId);
    fetchFiles(); 
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <AddFile getFiles={fetchFiles} />
      <FileList files={files} onDelete={deleteFile} />
    </div>
  );
}
