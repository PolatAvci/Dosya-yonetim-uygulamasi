import React from "react";
import { baseURL } from "../../config";
import "./FileList.css";

export default function FileList({ files }) {
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
      <ul className="image-list">
        {imageFiles.map((file) => (
          <li key={file.id} className="card">
            <img src= {`${baseURL}/uploads/${file.filePath}`} alt={`${file.name}`} />
            <strong>{file.name}</strong> - {file.description}
            <br />
          </li>
        ))}
      </ul>

      <h1>📄 Dosyalarım</h1>
      <ul>
        {pdfFiles.map((file) => (
          <li key={file.id}>
            <strong>{file.name}</strong> - {file.description}
            <br />
            <a href={`${baseURL}/uploads/${file.filePath}`} target="_blank" rel="noreferrer">
              PDF Aç
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
