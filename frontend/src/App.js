import React from "react";
import Footer from "./components/layout/Footer/Footer";
import './App.css';
import BannerSlider from "./components/layout/MainSection/BannerSlider";
import MainPage from "./pages/main/MainPage";



function App() {
  return (
    <div className="App">
    <MainPage />
        <Footer />
    </div>
  );
}

export default App;

