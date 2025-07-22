import React from 'react';

const SignalResultDisplay = ({ result }) => {
  if (!result) return null;

  return (
    <div className="flex flex-col gap-lg mt-lg">
      <h2 className="text-textPrimary text-2xl mb-md">신호 처리 결과</h2>
      <div className="bg-surface rounded-md shadow-md overflow-hidden">
        <h3 className="p-md bg-primary text-white m-0">신호 시각화</h3>
        <div className="p-md flex justify-center items-center bg-black">
          <img src={result.plot_url} alt="신호 시각화" className="max-w-full object-contain" />
        </div>
        <div className="p-md flex flex-wrap gap-lg">
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-textPrimary mb-sm pb-sm border-b border-border">
              입력 신호
            </h4>
            <div className="flex justify-between py-sm border-b border-border">
              <span className="text-textSecondary">데이터 길이</span>
              <span className="text-textPrimary font-medium">{result.input_length}</span>
            </div>
            <div className="flex justify-between py-sm">
              <span className="text-textSecondary">SNR</span>
              <span className="text-textPrimary font-medium">{result.input_snr.toFixed(2)} dB</span>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-textPrimary mb-sm pb-sm border-b border-border">
              출력 신호
            </h4>
            <div className="flex justify-between py-sm border-b border-border">
              <span className="text-textSecondary">데이터 길이</span>
              <span className="text-textPrimary font-medium">{result.output_length}</span>
            </div>
            <div className="flex justify-between py-sm">
              <span className="text-textSecondary">SNR</span>
              <span className="text-textPrimary font-medium">{result.output_snr.toFixed(2)} dB</span>
            </div>
          </div>
        </div>
        <div className="p-md flex gap-md">
          <a 
            href={result.csv_url} 
            download 
            className="btn btn-primary"
          >
            CSV 다운로드
          </a>
          <a 
            href={result.plot_url} 
            download 
            className="btn btn-primary"
          >
            이미지 다운로드
          </a>
        </div>
      </div>

      <div className="mt-md p-md bg-surface rounded-md text-textSecondary text-sm">
        처리 시간: {result.processing_time.toFixed(2)}초
      </div>
    </div>
  );
};

export default SignalResultDisplay; 