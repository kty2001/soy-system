import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || '';
const API_URL = 'http://localhost:8000';

// 이미지 디블러링 API
export const processDeblur = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/api/deblur/process`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || '이미지 디블러링 처리 중 오류가 발생했습니다.');
  }
};

// 이미지 디노이징 API
export const processDenoise = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/api/denoise/process`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || '이미지 디노이징 처리 중 오류가 발생했습니다.');
  }
};

// 신호 디노이징 API
export const processSignal = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/api/signal/process`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || '신호 디노이징 처리 중 오류가 발생했습니다.');
  }
};

export const getSampleSignal = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/signal/sample`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || '샘플 신호 처리 중 오류가 발생했습니다.');
  }
}; 

export const processSoyanalysis = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/soyanalysis/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
    console.log('soyanalysis 응답:', response.data)
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || '두유 분석 중 오류가 발생했습니다.');
  }
}; 

export const processSoymilk = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/soymilk/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
    console.log('soymilk 응답:', response.data)
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || '두유 자르기 중 오류가 발생했습니다.');
  }
}; 
