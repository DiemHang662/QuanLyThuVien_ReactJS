import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import DocGiaList from './components/NguoiDung/DocGiaList';
import Login from './components/NguoiDung/Login';
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
          <Route path="/docgia" element={user ? <DocGiaList /> : <Navigate to="/login" />} />
          <Route path="/danhmuc" element={user ? <MainLayout /> : <Navigate to="/login" />} />
          <Route path="/sach" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
