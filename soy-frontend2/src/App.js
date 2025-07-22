import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SoyanalysisPage from './pages/SoyanalysisPage';
import SoymilkPage from './pages/SoymilkPage';
import SoyvidPage from './pages/SoyvidPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/soyanalysis" element={<SoyanalysisPage />} />
        <Route path="/soymilk" element={<SoymilkPage />} />
        <Route path="/soyvid" element={<SoyvidPage />} />
      </Routes>
    </Layout>
  );
}

export default App; 