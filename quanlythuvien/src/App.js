import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import TongQuan from './components/Home/TongQuan';
import NguoiDungList from './components/NguoiDung/NguoiDungList';
import Profile from './components/NguoiDung/Profile';
import Register from './components/NguoiDung/Register';
import Login from './components/NguoiDung/Login';
import SachList from './components/Sach/SachList';
import SachDetail from './components/Sach/SachDetail';
import MuonTraChart from './components/Sach/MuonTraChart';
import PhieuMuonList from './components/PhieuMuon/PhieuMuonList';
import MuonTra from './components/PhieuMuon/MuonTra';
import './App.css';
import { MyUserContext } from './configs/Contexts';
import MainLayout from './components/Navbar/MainLayout';

function App() {
  const user = useContext(MyUserContext);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tongquan" element={user ? <TongQuan /> : <Navigate to="/login" />} />
          <Route path="/nguoidung" element={user ? <NguoiDungList /> : <Navigate to="/login" />} />
          <Route path="/dangki" element={user ? <Register /> : <Navigate to="/login" />} />
          <Route path="/danhmuc" element={user ? <MainLayout /> : <Navigate to="/login" />} />
          <Route path="/sach" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/sach/:id" element={user ? <SachDetail /> : <Navigate to="/login" />} />
          <Route path="/dssach" element={user ? <SachList /> : <Navigate to="/login" />} />
          <Route path="/bctk" element={user ? <MuonTraChart /> : <Navigate to="/login" />} />
          <Route path="/phieumuon" element={user ? <PhieuMuonList /> : <Navigate to="/login" />} />
          <Route path="/muontra" element={user ? <MuonTra /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
