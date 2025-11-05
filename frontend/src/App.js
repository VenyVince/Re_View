import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/main/MainPage';
import Footer from './components/layout/Footer/Footer';
import Header from "./components/layout/Header/Header";
//import LoginPage from './pages/login/LoginPage'; // ✅ 예시 로그인 페이지 추가

export default function App() {
    return (
        <div className="App">
            <Header />
            {/* 라우트 정의 */}
            <Routes>
                <Route path="/" element={<MainPage />} />
                {/*<Route path="/login" element={<LoginPage />} /> /!* ✅ 로그인 페이지 라우트 *!/*/}
            </Routes>

            {/* 공통 Footer */}
            <Footer />
        </div>
    );
}