import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { AllPage } from './pages/AllPage';
import MyImagesPage from './pages/MyImages/MyImagesPage';
import MyFiles from './pages/MyFiles/MyFiles';
import AddFile from './components/AddFile/AddFile';
import ImageDetailPage from './pages/ImageDetailPage/ImageDetailPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/404/NotFound';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dosyalarim" element={<MyFiles />} />
        <Route path="/görsellerim" element={<MyImagesPage />} />
        <Route path="/tümü" element={<AllPage />} />
        <Route path="/ekle" element={<AddFile />} />
        <Route path="/images/:id" element={<ImageDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
