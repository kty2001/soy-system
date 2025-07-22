import React from 'react';
import { Link } from 'react-router-dom';
import { FaWaveSquare } from 'react-icons/fa';
import { MdBlurOn, MdCleaningServices } from 'react-icons/md';

const HomePage = () => {
  return (
    <div className="p-lg">
      <h1 className="text-textPrimary text-3xl mb-lg">THz AI 처리 시스템</h1>
      <p className="text-textSecondary mb-xl max-w-[800px] leading-relaxed">
        테라헤르츠(THz) 이미지 및 신호 처리를 위한 AI 기반 시스템입니다. 
        이미지 디블러링, 이미지 디노이징, 신호 디노이징 기능을 제공합니다.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg mt-xl">
        <Link 
          to="/deblur"
          className="bg-surface rounded-md p-lg shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-fast flex flex-col items-center text-center"
        >
          <div className="text-5xl text-primary mb-md">
            <MdBlurOn />
          </div>
          <h3 className="text-textPrimary text-xl mb-md">이미지 디블러링</h3>
          <p className="text-textSecondary text-sm">
            흐릿한 THz 이미지를 선명하게 만들어 이미지 품질을 향상시킵니다.
          </p>
        </Link>

        <Link 
          to="/denoise"
          className="bg-surface rounded-md p-lg shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-fast flex flex-col items-center text-center"
        >
          <div className="text-5xl text-primary mb-md">
            <MdCleaningServices />
          </div>
          <h3 className="text-textPrimary text-xl mb-md">이미지 디노이징</h3>
          <p className="text-textSecondary text-sm">
            THz 이미지의 노이즈를 제거하여 이미지 품질을 향상시킵니다.
          </p>
        </Link>

        <Link 
          to="/signal"
          className="bg-surface rounded-md p-lg shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-fast flex flex-col items-center text-center"
        >
          <div className="text-5xl text-primary mb-md">
            <FaWaveSquare />
          </div>
          <h3 className="text-textPrimary text-xl mb-md">신호 디노이징</h3>
          <p className="text-textSecondary text-sm">
            THz 신호의 노이즈를 제거하여 신호 품질을 향상시킵니다.
          </p>
        </Link>

        <Link 
          to="/soyanalysis"
          className="bg-surface rounded-md p-lg shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-fast flex flex-col items-center text-center"
        >
          <div className="text-5xl text-primary mb-md">
            <FaWaveSquare />
          </div>
          <h3 className="text-textPrimary text-xl mb-md">두유 분석</h3>
          <p className="text-textSecondary text-sm">
            두유의 성분을 분석합니다.
          </p>
        </Link>

        <Link 
          to="/soymilk"
          className="bg-surface rounded-md p-lg shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-fast flex flex-col items-center text-center"
        >
          <div className="text-5xl text-primary mb-md">
            <FaWaveSquare />
          </div>
          <h3 className="text-textPrimary text-xl mb-md">두유 이미지 처리</h3>
          <p className="text-textSecondary text-sm">
            두유 농도 이미지를 처리하여 예측을 돕습니다.
          </p>
        </Link>

        <Link 
          to="/soyvid"
          className="bg-surface rounded-md p-lg shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-fast flex flex-col items-center text-center"
        >
          <div className="text-5xl text-primary mb-md">
            <FaWaveSquare />
          </div>
          <h3 className="text-textPrimary text-xl mb-md">두유 영상 예측</h3>
          <p className="text-textSecondary text-sm">
            두유 측정기 영상에서 농도를 예측합니다.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage; 