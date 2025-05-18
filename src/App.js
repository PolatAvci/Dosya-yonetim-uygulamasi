import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { AllPage } from './pages/AllPage';
import MyImagesPage from './pages/MyImages/MyImagesPage';
import MyFiles from './pages/MyFiles/MyFiles';
import AddFile from './components/AddFile/AddFile';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AllPage />} />
        <Route path="/dosyalarim" element={<MyFiles />} />
        <Route path="/görsellerim" element={<MyImagesPage />} />
        <Route path="/tümü" element={<AllPage />} />
        <Route path="/ekle" element={<AddFile />} />
      </Routes>
    </Router>
  );
}

export default App;
