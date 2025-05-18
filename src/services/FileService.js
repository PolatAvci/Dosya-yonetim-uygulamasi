import {FileRecord} from '../models/file.js';
import axios from 'axios';
import { baseURL } from '../config.js'; 


export class FileService {

    static fetchFiles = async () => {
        const response = await axios.get(baseURL + '/files');
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
        const response = await axios.post(baseURL + '/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });
    } catch (error) {
        console.error('Yükleme hatası:', error);
    }
    };

    static handleDelete = async (id) => {
        await axios.delete(baseURL + `/files/delete/${id}`);
    };
}