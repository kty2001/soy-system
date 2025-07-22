import React, { useState } from 'react';
import FileDropzone from '../components/FileDropzone';
import ResultDisplay from '../components/ResultDisplay';
import { processSoymilk } from '../utils/api';


const SoymilkPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileDrop = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await processSoymilk(file);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-lg">
      <h1 className="text-textPrimary text-3xl mb-md">두유 농도 계측</h1>
      <p className="text-textSecondary mb-xl max-w-[800px] leading-relaxed">
        흐릿한 두유 농도 경계선을 선명하게 만들어 계측 품질을 향상시킵니다.
        이미지 파일을 업로드하면 OpenCV를 이용해 경계선을 향상시킵니다.
      </p>

      {error && (
        <div className="p-md bg-error/20 border-l-4 border-error text-textPrimary mb-lg rounded-sm">
          {error}
        </div>
      )}

      <FileDropzone
        onFileDrop={handleFileDrop}
        acceptedFileTypes={{ 'image/*': ['.png', '.jpg', '.jpeg', '.bmp'] }}
        fileTypeDescription="PNG, JPG, BMP 파일만 허용됩니다."
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center p-xl bg-surface rounded-md shadow-md">
          <p className="text-textPrimary mt-md">이미지 처리 중...</p>
        </div>
      ) : (
        <ResultDisplay result={result} metricName="선명도" />
      )}
    </div>
  );
};

export default SoymilkPage; 