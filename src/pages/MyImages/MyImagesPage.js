import React from 'react';
import './MyImagesPage.css';
import { FaTrash } from 'react-icons/fa';
import { baseURL } from '../../config'; // Adjust the import path as necessary
import { useState, useEffect } from 'react';
import { FileService } from '../../services/FileService'; // Adjust the import path as necessary


export default function MyImages() {
    const [imageFiles, setFiles] = useState([]);

    const fetchFiles = async () => {
        const fetched = await FileService.fetchFiles();
        const imageExtensions = ["jpeg", "png", "jpg"];
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
            <h1>📷 Görsellerim</h1>
                {imageFiles.length > 0 ? (
                    <ul className="image-list">
                    {imageFiles.map((file) => (
                        <li key={file.id} className="card">
                        <button className="delete-btn" onClick={() => onDelete(file.id)}>
                            <FaTrash />
                        </button>
                        <a href={`${baseURL}/uploads/${file.filePath}`} target="_blank" rel="noreferrer">
                        <img src={`${baseURL}/uploads/${file.filePath}`} alt={file.name} />
                        </a>
                        <a href={`/images/${file.id}`} rel="noreferrer">
                            <strong>{file.name}</strong>
                        </a>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p>Henüz yüklenmiş görsel yok.</p>
                )}
        </div>
    );
}