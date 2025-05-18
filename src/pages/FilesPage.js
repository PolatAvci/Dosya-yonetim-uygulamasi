import React, { useState, useEffect } from 'react';
import AddFile from '../components/AddFile/AddFile';
import FileList from '../components/FileList/FileList';
import { FileService } from '../services/FileService';

export function FilesPage() {
  const [files, setFiles] = useState([]);

  const getFiles = async () => {
    const fetchedFiles = await FileService.fetchFiles();
    setFiles(fetchedFiles);
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div>
      <AddFile getFiles={getFiles} />
      <FileList files={files} />
    </div>
  );
}
