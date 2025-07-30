import React, { useState } from 'react';

const AnalysisResultDisplay = ({ result, metricName }) => {
  const [values, setValues] = useState(["", "", "", "", ""]);
  
  if (!result) return null;

  const handleInputChange = (index, newValue) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
  };

  // 파일 이름 생성 함수
  const generateFilename = (base) => {
    const cleaned = values.map(v => (v || "0").replace(/\./g, "_")); // 소수점 → _
    return `${base}_${cleaned.join("_")}.png`;
  };

  return (
    <div className="flex flex-col gap-lg mt-lg">
      <h2 className="text-textPrimary text-2xl mb-md">처리 결과</h2>
      <div className="flex gap-lg flex-wrap">
        <div className="flex-1 min-w-[300px] bg-surface rounded-md shadow-md overflow-hidden">
          <h3 className="p-md bg-primary text-white m-0">입력 이미지</h3>
          <div className="p-md flex justify-center items-center bg-black min-h-[300px]">
            <img 
              src={result.input_image_url} 
              alt="입력 이미지"
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="p-md">
            <div className="flex justify-between py-sm">
              <span className="text-textSecondary">크기</span>
              <span className="text-textPrimary font-medium">
                {result.input_width} x {result.input_height}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-lg flex-wrap">
        <div className="flex-1 min-w-[300px] bg-surface rounded-md shadow-md overflow-hidden">
          <h3 className="p-md bg-primary text-white m-0">크롭 이미지</h3>
          <div className="p-md flex justify-center items-center bg-black min-h-[300px]">
            <img 
              src={result.cropped_image_url} 
              alt="크롭 이미지"
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="p-md">
            <div className="flex justify-between py-sm border-b border-border">
              <span className="text-textSecondary">W x H</span>
              <span className="text-textPrimary font-medium">
                {result.output_width} x {result.output_height}
              </span>
            </div>
            <div className="flex justify-between py-sm border-b border-border">
              <span className="text-textSecondary">Average angle</span>
              <span className="text-textPrimary font-medium">
                {result.average_angle.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-sm border-b border-border">
              <span className="text-textSecondary">Predict value</span>
              <span className="text-textPrimary font-medium">
                {result.predict_value}
              </span>
            </div>
            <div className="flex justify-end">
              <a href={result.cropped_image_url} download rel="noopener noreferrer"
              className="inline-block mt-md px-4 py-2 bg-primary text-white font-semibold rounded-md shadow hover:bg-primary-dark transition duration-200">
                이미지 저장</a>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[300px] bg-surface rounded-md shadow-md overflow-hidden">
          <h3 className="p-md bg-primary text-white m-0">분석 이미지</h3>
          <div className="p-md flex justify-center items-center bg-black min-h-[300px]">
            <img 
              src={result.output_image_url} 
              alt="분석 이미지"
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="p-md">
            <div className="flex justify-between py-sm border-b border-border">
              <span className="text-textSecondary">Min_index</span>
              <span className="text-textPrimary font-medium">
                {result.min_index}
              </span>
            </div>
            <div className="flex justify-between py-sm border-b border-border">
              <span className="text-textSecondary">Width</span>
              <span className="text-textPrimary font-medium">
                {result.width}
              </span>
            </div>
            <div className="flex justify-between py-sm border-b border-border">
              <span className="text-textSecondary">Predict value</span>
              <span className="text-textPrimary font-medium">
                {result.predict_value}
              </span>
            </div>
            <div className="flex justify-end">
              <a href={result.output_image_url} download={generateFilename("analysis")} rel="noopener noreferrer"
              className="inline-block mt-md px-4 py-2 bg-primary text-white font-semibold rounded-md shadow hover:bg-primary-dark transition duration-200">
                이미지 저장</a>
            </div>
          </div>
        </div>
      </div>

      {/* 실수 입력란 */}
      <div className="grid grid-cols-5 gap-md mb-md">
        {values.map((val, idx) => (
          <input
            key={idx}
            type="number"
            step="any"
            className="bg-surface border border-border text-textPrimary rounded-md px-2 py-1"
            placeholder={`에측값 ${idx + 1}`}
            value={val}
            onChange={(e) => handleInputChange(idx, e.target.value)}
          />
        ))}
      </div>

      <div className="mt-md p-md bg-surface rounded-md text-textSecondary text-sm">
        처리 시간: {result.processing_time.toFixed(2)}초
      </div>
    </div>
  );
};

export default AnalysisResultDisplay; 