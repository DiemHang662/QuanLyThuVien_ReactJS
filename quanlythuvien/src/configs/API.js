import axios from 'axios';

const BASE_URL = 'http://192.168.1.10:8000';

export const endpoints = {
  nguoidung: '/api/nguoidung/',
  lockAccount: (id) => `/api/nguoidung/${id}/lock-account/`,
  createUser: '/api/nguoidung/create-user/',
  deleteUser: (id) => `/api/nguoidung/${id}/delete-user/`,
  updateUser: (id) => `/api/nguoidung/${id}/`,
  currentUser: '/api/nguoidung/current-user/',
  userCount:'/api/nguoidung/user-count/',
  changePassword: '/api/nguoidung/change-password/',
  login: '/o/token/',

  danhmuc: '/api/danhmuc/',
  createDanhMuc: '/api/danhmuc/create-danhmuc/',
  deleteDanhMuc: (id) => `/api/danhmuc/${id}/delete-danhmuc/`,
  updateDanhMuc: (id) => `/api/danhmuc/${id}/`,

  sach: '/api/sach/',
  sachMoiCapNhat:'/api/sach/recent-books/',
  sachChiTiet: (id) => `/api/sach/${id}/`,
  sachByDanhMuc: (danhMucId) => `api/sach/${danhMucId}/by-danhmuc/`,
  createSach: '/api/sach/create-sach/',
  soLanMuonTraQuaHan: (id) => `/api/sach/${id}/so-lan-muon-tra-quahan/`,
  deleteSach: (id) => `/api/sach/${id}/delete-sach/`,
  updateSach: (id) => `/api/sach/${id}/`,
  bookCount:'/api/sach/book-count/',

  phieuMuon: '/api/phieumuon/',
  createPhieuMuon: '/api/phieumuon/create-phieumuon/',
  deletePhieuMuon: (id) => `/api/phieumuon/${id}/delete-phieumuon/`,
  updatePhieuMuon: (id) => `/api/phieumuon/${id}/`,

  chiTietPhieuMuon: '/api/chitietphieumuon/',
  createChiTietPhieuMuon: '/api/chitietphieumuon/',
  deleteChiTietPhieuMuon: (id) => `/api/chitietphieumuon/${id}/`,
  updateChiTietPhieuMuon: (id) => `/api/chitietphieumuon/${id}/`,

  borrowedBooks: (id) => `/api/nguoidung/${id}/borrowed-books/`,

  mostBorrowed: '/api/sach/most-borrowed/',
  mostLiked: '/api/sach/most-liked/',
  mostCommented: '/api/sach/most-commented/',
  mostReturnedBooks: '/api/sach/most-returned-books/',
  mostBorrowedBooks: '/api/sach/most-borrowed-books/',
  mostLateBooks: '/api/sach/most-late-books/',
  interCount: '/api/sach/total-interactions/',
  borrowReturnCount: '/api/sach/total-borrow-return-counts/',
  borrowReturnLateStatistics: '/api/sach/borrow-return-late-statistics/',
  likeCount: (id) => `/api/sach/${id}/like-count/`,
  toggle_like: (bookId) => `/api/thich/${bookId}/toggle-like/`,
  thongKeTheoDanhMuc: '/api/sach/thong-ke-theo-danh-muc/',
  
  binhluan: (bookId) => `api/binhluan/?sach_id=${bookId}`,
  create_comment: (bookId) => `/api/binhluan/${bookId}/create-comment/`,

  share: (id) => `/api/chiase/${id}/share/`,

  zalo: 'api/payment/zalopay/order/',

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

// AVInclKyPlwzK7Zah5IKATAOc0ewc1tItFhhYA1s6xYMywa21zxzn8PaRUHmTGdCCIoPSpAH-TNlJLfn