import { FileRecord } from '../models/file.js';
import axios from 'axios';
import { baseURL } from '../config.js';

export class FileService {
    static getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`
        };
    };

    static fetchFiles = async () => {
        const response = await axios.get(baseURL + '/files', {
            headers: this.getAuthHeader()
        });
        const files = response.data.map(fileJson => FileRecord.fromJson(fileJson));
        return files;
    };

    static handleUpload = async (selectedFile, description) => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', selectedFile.name);
        formData.append('description', description);

        try {
            await axios.post(baseURL + '/files/upload', formData, {
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error('Yükleme hatası:', error);
            throw error;
        }
    };

    static handleDelete = async (id) => {
        try {
            await axios.delete(baseURL + `/files/delete/${id}`, {
                headers: this.getAuthHeader()
            });
        } catch (error) {
            console.error('Silme hatası:', error);
            throw error;
        }
    };
}
