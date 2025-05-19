import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { baseURL } from '../../config';
import { FileService } from '../../services/FileService';
import './MyFiles.css';
import { useCallback } from 'react';
import Unauth from '../../components/Unauth/Unauth';

export default function MyFiles() {
    const [pdfFiles, setFiles] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Token kontrolü
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }
    , []);

        const fetchFiles = useCallback(async () => {
            if (!isLoggedIn) {
                setFiles([]);
                return;
            }
            const fetched = await FileService.fetchFiles();
            const imageExtensions = ["pdf"];
            const filteredFiles = fetched.filter((file) =>
                imageExtensions.includes(file.filePath.split(".").pop().toLowerCase())
            );
            setFiles(filteredFiles);
        }, [isLoggedIn]);
    
          useEffect(() => {
            fetchFiles();
          }, [fetchFiles]);
    
        const onDelete = async (id) => {
            if (!isLoggedIn) {
                setFiles([]);
                return;
            }
            await FileService.handleDelete(id);
            fetchFiles();
        }
    if (!isLoggedIn) {
        return ( <Unauth />);
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
                            <a href={`${baseURL}/uploads/${file.filePath}`} target="_blank" rel="noreferrer">
                                PDF Aç
                            </a>
                            </li>
                     ))}
                    </ul>
                    ) : (
                        <p>Henüz yüklenmiş PDF yok.</p>   
                    )}
       </div>
    );
}