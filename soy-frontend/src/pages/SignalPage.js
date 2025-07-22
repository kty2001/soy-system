import React, { useState } from 'react';
import FileDropzone from '../components/FileDropzone';
import SignalResultDisplay from '../components/SignalResultDisplay';
import { processSignal, getSampleSignal } from '../utils/api';

const SignalPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileDrop = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await processSignal(file);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getSampleSignal();
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-lg">
      <h1 className="text-textPrimary text-3xl mb-md">신호 디노이징</h1>
      <p className="text-textSecondary mb-xl max-w-[800px] leading-relaxed">
        THz 신호의 노이즈를 제거하여 신호 품질을 향상시킵니다.
        CSV 파일을 업로드하면 AI 모델이 신호를 처리하여 노이즈가 제거된 신호를 생성합니다.
      </p>

      {error && (
        <div className="p-md bg-error/20 border-l-4 border-error text-textPrimary mb-lg rounded-sm">
          {error}
        </div>
      )}

      <div className="flex gap-md mb-lg">
        <button 
          onClick={handleSampleClick}
          className="btn btn-primary"
        >
          샘플 신호 처리
        </button>
      </div>

      <FileDropzone
        onFileDrop={handleFileDrop}
        acceptedFileTypes={{ 'text/csv': ['.csv'] }}
        fileTypeDescription="CSV 파일만 허용됩니다."
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center p-xl bg-surface rounded-md shadow-md">
          <p className="text-textPrimary mt-md">신호 처리 중...</p>
        </div>
      ) : (
        <SignalResultDisplay result={result} />
      )}
    </div>
  );
};

export default SignalPage; 