import React, { useState, useEffect } from 'react';
import { FileRecord } from './models/file';
import axios from 'axios';

let baseURL = 'http://localhost:5000';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');

  const fetchFiles = async () => {
    const response = await axios.get(baseURL + '/files');
    const files = response.data.map(fileJson => FileRecord.fromJson(fileJson));
    setFiles(files);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

 const handleUpload = async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('name', selectedFile.name); // zorunlu alan
  formData.append('description', description); // isteğe bağlı ama gönder

  try {
    const response = await axios.post(baseURL + '/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error('Yükleme hatası:', error);
  }
  fetchFiles();
};

  const handleDelete = async (id) => {
    await axios.delete(baseURL + `/files/delete/${id}`);
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  console.log(files);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📂 Dosyalarım</h1>

      <input type="file" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
      <input type="text" placeholder='Açıklama' value={description} onChange={e => setDescription(e.target.value)} />
      <button
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        Yükle
      </button>

      <h2 className="mt-6 mb-2 font-semibold text-lg">Yüklenen Dosyalar:</h2>
      <ul className="space-y-2">
        {files.map((file) => (
          <li key={file.id} className="flex items-center justify-between border-b py-2">
            <a href={baseURL + `/uploads/${file.filePath}`} target="_blank" rel="noreferrer">
              {file.name}
            </a>
            <button
              className="text-red-500 hover:underline"
              onClick={() => handleDelete(file.id)}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
