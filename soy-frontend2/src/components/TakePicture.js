import React, { useRef, useState, useEffect } from 'react';

const TakePicture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("카메라 접근 실패:", err);
      }
    };

    startCamera();
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
    }
  };

  return (
    <div className="flex flex-col gap-lg mt-lg">
      <h2 className="text-textPrimary text-2xl mb-md">카메라 촬영</h2>
      <div className="flex gap-lg flex-wrap">

        <div className="flex-1 min-w-[300px] bg-surface rounded-md shadow-md overflow-hidden">
          <h3 className="p-md bg-primary text-white m-0">카메라 화면</h3>
          <div className="p-md flex justify-center items-center bg-black min-h-[300px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="p-md flex justify-end">
            <button
              onClick={captureImage}
              className="px-4 py-2 bg-primary text-white font-semibold rounded-md shadow hover:bg-primary-dark transition duration-200"
            >
              촬영하기
            </button>
          </div>
        </div>

        {capturedImage && (
          <div className="flex-1 min-w-[300px] bg-surface rounded-md shadow-md overflow-hidden">
            <h3 className="p-md bg-primary text-white m-0">촬영된 이미지</h3>
            <div className="p-md flex justify-center items-center bg-black min-h-[300px]">
              <img
                src={capturedImage}
                alt="Captured"
                className="max-w-full max-h-[500px] object-contain"
              />
            </div>
            <div className="p-md flex justify-end">
              <a href={capturedImage} download="captured_image.png"
                className="inline-block px-4 py-2 bg-primary text-white font-semibold rounded-md shadow hover:bg-primary-dark transition duration-200"
              >이미지 저장</a>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default TakePicture;
