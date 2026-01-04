import axios from 'axios';
import { store } from '../store/store';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터: 모든 요청에 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // Redux store에서 토큰 가져오기
    const state = store.getState();
    const token = state.auth.token;

    // 토큰이 있으면 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 (인증 실패) 처리
    if (error.response?.status === 401) {
      // 로그아웃 처리 또는 로그인 페이지로 리다이렉트
      console.error('인증이 만료되었습니다. 다시 로그인해주세요.');
      // 필요시: store.dispatch(logout());
      // 필요시: window.location.href = '/';
    }

    // 403 에러 (권한 없음)
    if (error.response?.status === 403) {
      console.error('접근 권한이 없습니다.');
    }

    // 500 에러 (서버 에러)
    if (error.response?.status === 500) {
      console.error('서버 오류가 발생했습니다.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;