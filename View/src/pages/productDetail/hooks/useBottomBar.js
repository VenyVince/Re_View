// src/pages/productDetail/hooks/useBottomBar.js

export default function useBottomBar() {
    const adjustBottomBarPosition = () => {
        const bottomBar = document.querySelector(".pd-bottom-bar");
        const footer = document.querySelector("footer");
        if (!bottomBar || !footer) return;

        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top < window.innerHeight) {
            const overlap = window.innerHeight - footerRect.top;
            bottomBar.style.bottom = `${overlap}px`;
        } else {
            bottomBar.style.bottom = "0px";
        }
    };

    return { adjustBottomBarPosition };
}
