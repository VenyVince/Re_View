import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/main/MainPage';
import Footer from './components/layout/Footer/Footer';
import TermsPage from './pages/footer/TermsPage'; // 이용약관 페이지
import PrivacyPage from './pages/footer/PrivacyPage'; // 개인정보처리 방침 페이지
import NoticePage from './pages/footer/NoticePage'; // 공지사항 페이지
import FaqPage from './pages/footer/FaqPage'; // Faq 페이지
import AdsPage from "./pages/footer/AdsPage"; // 광고 문의 페이지
import NoticeDetail from "./pages/footer/NoticeDetail"; // 공지사항 상세 페이지
import SearchPage from './pages/search/SearchPage';
import Header from "./components/layout/Header/Header";
import SurveyPage from "./pages/survey/SurveyPage"; // 설문조사 페이지
import SurveyResult from "./pages/survey/SurveyResult"; // 설문조사 결과 페이지

export default function App() {
    return (
        <div className="App">
            <Header />
            <main className="page-content"> {/* 푸터를 항상 하단에 고정하기 위해 라우터들 감쌈*/}
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/notice" element={<NoticePage/>} />
                <Route path="/notice/:id" element={<NoticeDetail />} />
                <Route path="/faq" element={<FaqPage/>} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/ads" element={<AdsPage/>}/>
                <Route path="/survey" element={<SurveyPage/>}/>
                <Route path="/survey/result" element={<SurveyResult/>}/>
            </Routes>
            </main>
            <Footer />
        </div>
    );
}
