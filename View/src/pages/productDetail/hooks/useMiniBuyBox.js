// src/pages/productDetail/hooks/useMiniBuyBox.js

export default function useMiniBuyBox() {

    // 미니 구매 박스 위치 보정
    const adjustMiniBoxPosition = () => {
        const miniBox = document.querySelector(".pd-mini-buy-box");
        const footer = document.querySelector("footer");
        if (!miniBox || !footer) return;

        const bottomBarHeight = 60;
        const footerRect = footer.getBoundingClientRect();

        if (footerRect.top < window.innerHeight) {
            const overlap = window.innerHeight - footerRect.top;
            miniBox.style.bottom = `${bottomBarHeight + overlap}px`;
        } else {
            miniBox.style.bottom = `${bottomBarHeight}px`;
        }
    };

    return { adjustMiniBoxPosition };
}
