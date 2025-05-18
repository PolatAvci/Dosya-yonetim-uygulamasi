import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { FilesPage } from './pages/FilesPage';
import MyImagesPage from './pages/MyImages/MyImagesPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FilesPage />} />
        <Route path="/dosyalarim" element={<FilesPage />} />
        <Route path="/görsellerim" element={<MyImagesPage />} />
        <Route path="/tümü" element={<FilesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
