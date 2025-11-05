import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header/Header';
import MainPage from './pages/main/MainPage';
import Footer from './components/layout/Footer/Footer';
import Header from "./components/layout/Header/Header";
import SearchPage from './pages/search/SearchPage';

export default function App() {
  return (
    <div className="App">
      {/*Header*/}
      <Header />
      {/* 라우트 정의 */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>

      {/* 공통 Footer */}
      <Footer />
    </div>
  );
}
