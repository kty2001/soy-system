import React, { useState } from 'react';
import FileDropzone from '../components/FileDropzone';
import AnalysisResultDisplay from '../components/AnalysisResultDisplay';
import { processSoyanalysis } from '../utils/api';

// const SoyanalysisPage = () => {
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFileDrop = async (file) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await processSoyanalysis(file);
//       setResult(response);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageContainer>
//       <Title>두유 농도 분석</Title>
//       <Description>
//         두유 이미지의 값을 분석하여 min_index와 width를 계산합니다.
//       </Description>

//       {error && <ErrorMessage>{error}</ErrorMessage>}

//       <FileDropzone
//         onFileDrop={handleFileDrop}
//         acceptedFileTypes={{ 'image/*': ['.png', '.jpg', '.jpeg', '.bmp'] }}
//         fileTypeDescription="PNG, JPG, BMP 파일만 허용됩니다."
//       />

//       {loading ? (
//         <LoadingContainer>
//           <LoadingText>이미지 처리 중...</LoadingText>
//         </LoadingContainer>
//       ) : (
//         <AnalysisResultDisplay result={result} metricName="선명도" />
//       )}
//     </PageContainer>
//   );
// };

// export default SoyanalysisPage; 

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