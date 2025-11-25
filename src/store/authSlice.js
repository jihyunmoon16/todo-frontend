import { createSlice } from '@reduxjs/toolkit';

// localStorage에서 토큰 복구
const loadTokenFromStorage = () => {
  try {
    const token = localStorage.getItem('authToken');
    return token || null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  token: loadTokenFromStorage(), // 초기 로드 시 localStorage에서 가져오기
  user: null,
  isAuthenticated: !!loadTokenFromStorage()
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      
      // localStorage에 토큰 저장
      localStorage.setItem('authToken', token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      
      // localStorage에서 토큰 제거
      localStorage.removeItem('authToken');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;