import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { baseURL } from '../../config'; // Adjust the import path as necessary
import { FileService } from '../../services/FileService'; // Adjust the import path as necessary
import './MyFiles.css'; // Adjust the import path as necessary

export default function MyFiles() {
     const [pdfFiles, setFiles] = useState([]);
    
        const fetchFiles = async () => {
            const fetched = await FileService.fetchFiles();
            const imageExtensions = ["pdf"];
            const filteredFiles = fetched.filter((file) =>
                imageExtensions.includes(file.filePath.split(".").pop().toLowerCase())
            );
            setFiles(filteredFiles);
        };
    
          useEffect(() => {
            fetchFiles();
          }, []);
    
        const onDelete = async (id) => {
            await FileService.handleDelete(id);
            fetchFiles();
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