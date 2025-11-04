import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


// React 애플리케이션이 실제로 렌더링될 HTML 요소 선택
// → public/index.html의 <div id="root"></div>를 가리킴
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



