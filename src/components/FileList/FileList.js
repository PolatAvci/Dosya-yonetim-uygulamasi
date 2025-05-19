import React from "react";
import { baseURL } from "../../config";
import "./FileList.css";
import { FaTrash } from "react-icons/fa";

export default function FileList({ files, onDelete }) {
  if (!files || !Array.isArray(files)) return <p>Dosyalar yükleniyor...</p>;

  const imageExtensions = ["jpeg", "png", "jpg"];
  const pdfExtensions = ["pdf"];

  const imageFiles = files.filter((file) =>
    imageExtensions.includes(file.filePath.split(".").pop().toLowerCase())
  );

  const pdfFiles = files.filter((file) =>
    pdfExtensions.includes(file.filePath.split(".").pop().toLowerCase())
  );

  return (
    <div className="container">
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

      <h1>📄 Dosyalarım</h1>
      {pdfFiles.length > 0 ? (
        <ul className="pdf-list">
          {pdfFiles.map((file) => (
            <li key={file.id} className="pdf-item">
              <strong>{file.name}</strong>
              <p className="description">{file.description}</p>
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
