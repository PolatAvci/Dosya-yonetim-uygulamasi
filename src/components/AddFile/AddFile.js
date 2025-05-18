import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddFile.css';
import { FileService } from '../../services/FileService.js';

const baseURL = 'http://localhost:5000';

export default function AddFile(){
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState('');
    const [fileInputKey, setFileInputKey] = useState(Date.now()); // file alanını sıfırlamak için


    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

   const uploadFile = async (file) => {
        console.log('Selected file:', file);
        console.log('Description:', description);
        if (!file) return;
        await FileService.handleUpload(file, description);
        getFiles();
        setFileInputKey(Date.now()); // file alanını sıfırlamak için
        setDescription('');
   };

   const getFiles = async () => {
    setFiles( await FileService.fetchFiles() );
    setFiles(files);
   };

    const handleDelete = async (id) => {
        await axios.delete(baseURL + `/files/delete/${id}`);
        getFiles();
    };

    useEffect(() => {
        getFiles();
    }, []);

    return(
        <div className='container'>
            <h1>Dosya Yükle</h1>
            <input key={fileInputKey} type="file" className='input' onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
            <input type="text" className='input' placeholder="Açıklama" value={description} onChange={e=> setDescription(e.target.value)} />
            <button className='button' onClick={() => uploadFile(selectedFile, description)} disabled={!selectedFile} >Yükle</button>
        </div>
    );
}