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
import SurveyIntro from './pages/survey/SurveyIntro'; // 설문조사 인트로
import SurveyPage from "./pages/survey/SurveyPage"; // 설문조사 페이지
import SurveyResult from "./pages/survey/SurveyResult"; // 설문조사 결과 페이지
import MyPage from "./pages/mypage/MyPage"; // 마이 페이지
import AdminProductPage from "./pages/mypage/admin/AdminProductPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./pages/mypage/admin/AdminLayout";
import AdminProductNew from "./pages/mypage/admin/AdminProductNew";
import AdminProductEdit from "./pages/mypage/admin/AdminProductEdit";
import AdminProductDeleteConfirm from "./pages/mypage/admin/AdminProductDeleteConfirm";


import LoginPage from './pages/login/LoginPage'; // 로그인 페이지
import FindSelect from './pages/login/find/FindSelect'; // 아이디 비밀번호 찾기 선택 페이지
import FindIdPage from './pages/login/find/FindIdPage'; // 아이지 찾기 페이지
import FindIdResult from './pages/login/find/FindIdResult';
import FindPasswordPage from './pages/login/find/FindPasswordPage'; // 비밀번호 찾기 페이지
import FindPasswordReset from './pages/login/find/FindPasswordReset';
import FindPasswordDone from './pages/login/find/FindPasswordDone';


import RegisterPage from './pages/register/RegisterPage'; // 회원가입 페이지
import RegisterComplete from "./pages/register/RegisterComplete"; // 회원가입 성공 페이지

export default function App() {
    return (
        <div className="App">
            <Header />
            <main className="page-content"> {/* 푸터를 항상 하단에 고정하기 위해 라우터들 감쌈*/}
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/find" element={<FindSelect />} />
                <Route path="/find/id" element={<FindIdPage/>} />
                <Route path="/find/id/result" element={<FindIdResult />} />
                <Route path="/find/password" element={<FindPasswordPage />} />
                <Route path="/find/password/reset" element={<FindPasswordReset />} />
                <Route path="/find/password/done" element={<FindPasswordDone />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/register/complete" element={<RegisterComplete />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/notice" element={<NoticePage/>} />
                <Route path="/notice/:id" element={<NoticeDetail />} />
                <Route path="/faq" element={<FaqPage/>} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/ads" element={<AdsPage/>}/>
                <Route path="/survey/intro" element={<SurveyIntro/>}/>
                <Route path="/survey" element={<SurveyPage/>}/>
                <Route path="/survey/result" element={<SurveyResult/>}/>
                <Route path="/mypage" element={<MyPage />} />

                {/* 관리자 전용 영역 */}
                <Route element={<ProtectedRoute requireAdmin />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="products" element={<AdminProductPage />} />
                        <Route path="products/new" element={<AdminProductNew />} />
                        <Route path="products/:id/edit" element={<AdminProductEdit />} />
                        <Route path="products/:id/delete" element={<AdminProductDeleteConfirm />} />
                    </Route>
                </Route>
            </Routes>
            </main>
            <Footer />
        </div>
    );
}
