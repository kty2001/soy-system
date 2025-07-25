import React, { useState } from 'react';
import FileDropzone from '../components/FileDropzone';
import AnalysisResultDisplay from '../components/AnalysisResultDisplay';
import { processSoyanalysis } from '../utils/api';
import TakePicture from '../components/TakePicture';

const SoyanalysisPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileDrop = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const response = await processSoyanalysis(file);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-lg">
      <h1 className="text-textPrimary text-3xl mb-md">두유 농도 분석</h1>
      <p className="text-textSecondary mb-xl max-w-[800px] leading-relaxed">
        두유 이미지의 경계 신호를 분석하여 <strong>min_index</strong>와 <strong>width</strong> 값을 계산합니다.
      </p>

      {error && (
        <div className="p-md bg-error/20 border-l-4 border-error text-textPrimary mb-lg rounded-sm">
          {error}
        </div>
      )}
      
      <TakePicture
        onCapture={(imageDataUrl) => {
          fetch(imageDataUrl)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "captured_image.png", { type: "image/png" });
              handleFileDrop(file);
            });
        }}
      />
      <div className="my-md" />
      <FileDropzone
        onFileDrop={handleFileDrop}
        acceptedFileTypes={{ 'image/*': ['.png', '.jpg', '.jpeg', '.bmp'] }}
        fileTypeDescription="PNG, JPG, BMP 파일만 허용됩니다."
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center p-xl bg-surface rounded-md shadow-md">
          <p className="text-textPrimary mt-md">두유 이미지 분석 중...</p>
        </div>
      ) : (
        <AnalysisResultDisplay result={result} metricName="선명도" />
      )}
    </div>
  );
};

export default SoyanalysisPage;