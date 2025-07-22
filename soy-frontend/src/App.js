import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DeblurPage from './pages/DeblurPage';
import DenoisePage from './pages/DenoisePage';
import SignalPage from './pages/SignalPage';
import SoyanalysisPage from './pages/SoyanalysisPage';
import SoymilkPage from './pages/SoymilkPage';
import SoyvidPage from './pages/SoyvidPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/deblur" element={<DeblurPage />} />
        <Route path="/denoise" element={<DenoisePage />} />
        <Route path="/signal" element={<SignalPage />} />
        <Route path="/soyanalysis" element={<SoyanalysisPage />} />
        <Route path="/soymilk" element={<SoymilkPage />} />
        <Route path="/soyvid" element={<SoyvidPage />} />
      </Routes>
    </Layout>
  );
}

export default App; 