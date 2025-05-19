import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../../config";
import "./ImageDetailPage.css";

export default function ImageDetailPage() {
  const { id } = useParams(); // URL'den id'yi al
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${baseURL}/files/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Dosya bulunamadı veya yetki yok.");
        }

        const data = await res.json();
        setFile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [id]);

  const imageExtensions = ["jpeg", "png", "jpg"];

  if (loading) return <p>Görsel yükleniyor...</p>;
  if (error) return <p>{error}</p>;
  if (!file) return <p>Görsel bulunamadı.</p>;

  const isImage = imageExtensions.includes(file.filePath.split(".").pop().toLowerCase());

  return (
    <div className="container">
      {isImage && (
        <img
          src={`${baseURL}/uploads/${file.filePath}`}
          alt={file.name}
          className="detail-image"
        />
      )}
      <h1>{file.name}</h1>
      <p>{file.description}</p>
    </div>
  );
}
