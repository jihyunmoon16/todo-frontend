import { createSlice } from '@reduxjs/toolkit';

// Recover token from localStorage
const loadTokenFromStorage = () => {
  try {
    const token = localStorage.getItem('authToken');
    return token || null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  token: loadTokenFromStorage(), // Load from localStorage on initial load
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

      // Save token to localStorage
      localStorage.setItem('authToken', token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      // Remove token from localStorage
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