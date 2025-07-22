import React from 'react';

const SoyVidPage = () => {
  return (
    <div className="p-lg">
      <h1 className="text-textPrimary text-3xl mb-md">실시간 웹캠 스트림</h1>
      <div className="w-full max-w-[960px] aspect-video bg-black rounded-md overflow-hidden shadow-md">
        <img
          src="http://127.0.0.1:8000/api/soyvid/process"
          alt="Video Stream"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SoyVidPage;