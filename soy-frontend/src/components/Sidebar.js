import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaImage, FaWaveSquare } from 'react-icons/fa';
import { MdBlurOn, MdCleaningServices } from 'react-icons/md';

const Sidebar = () => {
  return (
    <nav className="w-[240px] bg-surface p-md shadow-md">
      <h3 className="text-textSecondary text-sm mb-md pl-sm">메인 메뉴</h3>
      <NavLink 
        to="/" 
        end
        className={({ isActive }) => `
          flex items-center p-md rounded-md mb-sm text-textPrimary
          transition-colors duration-fast hover:bg-white/5
          ${isActive ? 'bg-primary text-white' : ''}
        `}
      >
        <FaImage className="mr-md text-lg" />
        홈
      </NavLink>

      <h3 className="text-textSecondary text-sm mb-md pl-sm">이미지 처리</h3>
      <NavLink 
        to="/deblur"
        className={({ isActive }) => `
          flex items-center p-md rounded-md mb-sm text-textPrimary
          transition-colors duration-fast hover:bg-white/5
          ${isActive ? 'bg-primary text-white' : ''}
        `}
      >
        <MdBlurOn className="mr-md text-lg" />
        이미지 디블러링
      </NavLink>
      <NavLink 
        to="/denoise"
        className={({ isActive }) => `
          flex items-center p-md rounded-md mb-sm text-textPrimary
          transition-colors duration-fast hover:bg-white/5
          ${isActive ? 'bg-primary text-white' : ''}
        `}
      >
        <MdCleaningServices className="mr-md text-lg" />
        이미지 디노이징
      </NavLink>

      <h3 className="text-textSecondary text-sm mb-md pl-sm">신호 처리</h3>
      <NavLink 
        to="/signal"
        className={({ isActive }) => `
          flex items-center p-md rounded-md mb-sm text-textPrimary
          transition-colors duration-fast hover:bg-white/5
          ${isActive ? 'bg-primary text-white' : ''}
        `}
      >
        <FaWaveSquare className="mr-md text-lg" />
        신호 디노이징
      </NavLink>

      <h3 className="text-textSecondary text-sm mb-md pl-sm">두유 처리</h3>
      <NavLink 
        to="/soyanalysis"
        className={({ isActive }) => `
          flex items-center p-md rounded-md mb-sm text-textPrimary
          transition-colors duration-fast hover:bg-white/5
          ${isActive ? 'bg-primary text-white' : ''}
        `}
      >
        <FaWaveSquare className="mr-md text-lg" />
        두유 분석
      </NavLink>

      <NavLink 
        to="/soymilk"
        className={({ isActive }) => `
          flex items-center p-md rounded-md mb-sm text-textPrimary
          transition-colors duration-fast hover:bg-white/5
          ${isActive ? 'bg-primary text-white' : ''}
        `}
      >
        <FaWaveSquare className="mr-md text-lg" />
        두유 이미지 처리
      </NavLink>

      <NavLink 
        to="/soyvid"
        className={({ isActive }) => `
          flex items-center p-md rounded-md mb-sm text-textPrimary
          transition-colors duration-fast hover:bg-white/5
          ${isActive ? 'bg-primary text-white' : ''}
        `}
      >
        <FaWaveSquare className="mr-md text-lg" />
        두유 영상 예측
      </NavLink>
    </nav>
  );
};

export default Sidebar; 