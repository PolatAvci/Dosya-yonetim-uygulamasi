import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../../config";
import "./ImageDetailPage.css";

export default function ImageDetailPage() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFileMetaAndImage = async () => {
      const token = localStorage.getItem("token");
      try {
        // Önce dosya meta bilgisini al
        const resMeta = await fetch(`${baseURL}/api/physicalfile/filemeta/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resMeta.ok) throw new Error("Dosya bulunamadı veya yetki yok.");

        const metaData = await resMeta.json();
        setFile(metaData);

        // Uzantıya göre resim olup olmadığını kontrol et
        const imageExtensions = ["jpeg", "jpg", "png", "gif", "bmp", "webp"];
        const ext = metaData.filePath.split(".").pop().toLowerCase();

        if (!imageExtensions.includes(ext)) {
          setImageSrc(null);
          return; // resim değil
        }

        // Dosya içeriğini binary olarak çek (blob)
        const resFile = await fetch(`${baseURL}/api/physicalfile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resFile.ok) throw new Error("Resim dosyası alınamadı.");

        const blob = await resFile.blob();

        // Blob'u base64 stringe dönüştür
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result);
        };
        reader.readAsDataURL(blob);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFileMetaAndImage();
  }, [id]);

  if (loading) return <p>Görsel yükleniyor...</p>;
  if (error) return <p>{error}</p>;
  if (!file) return <p>Görsel bulunamadı.</p>;

  return (
    <div className="container">
      {imageSrc ? (
        <img src={imageSrc} alt={file.name} className="detail-image" />
      ) : (
        <p>Bu dosya bir görsel değil veya görüntülenemiyor.</p>
      )}
      <h1>{file.name}</h1>
      <p>{file.description}</p>
    </div>
  );
}
