import axios from 'axios';

const BASE_URL = 'http://192.168.1.7:8000';

export const endpoints = {
  docgia: '/api/docgia/',
  createUser: '/api/nguoidung/create-user/',
  currentUser: '/api/nguoidung/current-user/',
  //   changePassword: '/api/residents/change-password/',
  //   changeAvatar: '/api/residents/change-avatar/',
  login: '/o/token/',
  danhmuc: '/api/danhmuc/',
  sach: '/api/sach/',
  toggle_like: (bookId) => `/api/thich/${bookId}/toggle-like/`,
  binhluan: (bookId) => `api/binhluan/?sach_id=${bookId}`,
  create_comment: (bookId) => `/api/binhluan/${bookId}/create-comment/`,
};

export const setAuthToken = (token) => {
  try {
    localStorage.setItem('access_token', token);
    console.log('Token set successfully:', token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const getAuthToken = () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found in localStorage');
    } else {
      console.log('Token retrieved successfully:', token);
    }
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw error;
  }
};

export const authApi = () => {
  try {
    const token = getAuthToken();
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error creating auth API instance:', error);
    throw error;
  }
};

export default axios.create({
  baseURL: BASE_URL,
});