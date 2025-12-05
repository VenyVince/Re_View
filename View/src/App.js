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
import SurveyIntro from './pages/survey/SurveyIntro'; // 설문조사 인트로
import SurveyPage from "./pages/survey/SurveyPage"; // 설문조사 페이지
import SurveyResult from "./pages/survey/SurveyResult"; // 설문조사 결과 페이지
import MyPage from "./pages/mypage/MyPage"; // 마이 페이지
import LoginPage from './pages/login/LoginPage'; // 로그인 페이지
import FindSelect from './pages/login/find/FindSelect'; // 아이디 비밀번호 찾기 선택 페이지
import FindIdPage from './pages/login/find/FindIdPage'; // 아이지 찾기 페이지
import FindIdResult from './pages/login/find/FindIdResult';
import FindPasswordPage from './pages/login/find/FindPasswordPage'; // 비밀번호 찾기 페이지
import FindPasswordReset from './pages/login/find/FindPasswordReset';
import FindPasswordDone from './pages/login/find/FindPasswordDone';
import RegisterPage from './pages/register/RegisterPage'; // 회원가입 페이지
import QnaPage from "./pages/qna/QnaPage";
import RegisterComplete from "./pages/register/RegisterComplete"; // 회원가입 성공 페이지

import ProductDetailPage from "./pages/productDetail/ProductDetailPage"; //상품 상세 페이지
import ReviewWrite from "./pages/review/ReviewWrite"; // 리뷰 작성 페이지
import ProductPage from "./pages/products/ProductPage"; // 상품 페이지
import ReviewPage from "./pages/reviews/ReviewPage"; //리뷰 페이지
import { AuthProvider } from "./context/AuthContext"; // 전역 로그인 컨텍스트
import ReviewDetail from "./pages/reviewDetail/ReviewDetailPage"; //리뷰상세페이지

import SearchPage from './pages/search/SearchPage';
import Header from "./components/layout/Header/Header";

import AdminProductPage from "./pages/mypage/admin/AdminProductPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./pages/mypage/admin/AdminLayout";
import AdminProductNew from "./pages/mypage/admin/AdminProductNew";
import AdminProductEdit from "./pages/mypage/admin/AdminProductEdit";
import AdminProductDeleteConfirm from "./pages/mypage/admin/AdminProductDeleteConfirm";
import AdminReviewPage from "./pages/mypage/admin/AdminReviewPage";
import AdminQnaPage from "./pages/mypage/admin/AdminQnaPage";
import AdminQnaAnswerPage from "./pages/mypage/admin/AdminQnaAnswerPage";
import AdminUserPage from "./pages/mypage/admin/AdminUserPage";
import AdminReviewReportPage from "./pages/mypage/admin/AdminReviewReportPage";

import UserProfileEdit from "./pages/mypage/user/profile/UserProfileEdit";

import TestProduct from "./TestProduct";
import UserCartPage from "./pages/mypage/user/cart/UserCartPage";
import UserAddressPage from "./pages/mypage/user/address/UserAddressPage";
import UserWishPage from "./pages/mypage/user/wish/UserWishPage";

import AboutPage from "./pages/about/AboutPage";
import UserCustomerPage from "./pages/mypage/user/customer/UserCustomerPage";
import UserSkinTestPage from "./pages/mypage/user/skin/UserSkinTestPage";
import UserReviewPage from "./pages/mypage/user/review/UserReviewPage";
import OrderPaymentPage from "./pages/order/OrderPaymentPage";
import OrderCompletePage from "./pages/order/OrderCompletePage";
import UserProtectedRoute from "./components/user/UserProtectedRoute";
import UserOrderDetailPage from "./pages/mypage/user/delivery/UserOrderDetailPage";

export default function App() {
    return (
        <AuthProvider>
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
                    <Route path="/survey/baumann" element={<SurveyPage/>}/>
                    <Route path="/survey/result" element={<SurveyResult/>}/>
                    {/*<Route path="/mypage" element={<MyPage />} />*/}
                    <Route path="/qna" element={<QnaPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/product/:productId" element={<ProductDetailPage />} />
                    <Route path="/review" element={<ReviewPage />} />
                    <Route path="/reviews" element={<ReviewPage />} />
                    <Route path="/review/:reviewId" element={<ReviewDetail />} />


                    {/* 리뷰 */}
                    <Route path="/review/write/:productId" element={<ReviewWrite />} /> {/* 리뷰 작성 */}

                {/* 관리자 전용 영역 */}
                <Route element={<ProtectedRoute requireAdmin />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="allproducts" element={<AdminProductPage />} />
                        <Route path="products/new" element={<AdminProductNew />} />
                        <Route path="products/:id/edit" element={<AdminProductEdit />} />
                        <Route path="products/:id/delete" element={<AdminProductDeleteConfirm />} />
                        <Route path="reviews" element={<AdminReviewPage />} />
                        <Route path="report" element={<AdminReviewReportPage />} />
                        <Route path="qna" element={<AdminQnaPage />} />
                        <Route path="qna/:id" element={<AdminQnaAnswerPage />} />
                        <Route path="users" element={<AdminUserPage />} />
                    </Route>
                </Route>

                {/*API 커넥트 예시용*/}
                <Route path="/test-products" element={<TestProduct />} />

                {/* ----- 유저 전용 보호 라우트 ----- */}
                <Route element={<UserProtectedRoute />}>
                    <Route path="/mypage" element={<MyPage />} />

                    <Route path="/mypage/address" element={<UserAddressPage />} />
                    <Route path="/mypage/profile" element={<UserProfileEdit />} />
                    <Route path="/mypage/cart" element={<UserCartPage />} />
                    <Route path="/mypage/wish" element={<UserWishPage />} />
                    <Route path="/mypage/cs" element={<UserCustomerPage />} />
                    <Route path="/mypage/skin" element={<UserSkinTestPage />} />
                    <Route path="/mypage/review" element={<UserReviewPage />} />
                    <Route path="/mypage/orders/:orderId" element={<UserOrderDetailPage />} />

                    <Route path="/order/payment" element={<OrderPaymentPage />} />
                    <Route path="/order/complete" element={<OrderCompletePage />} />
                </Route>
            </Routes>
            </main>
            <Footer />
        </div>
        </AuthProvider>

    );
}
