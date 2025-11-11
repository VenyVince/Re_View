// React를 불러와 컴포넌트 작성 가능하게 함
import React from 'react';

// react-icons에서 돋보기 아이콘(FaSearch) import
import { FaSearch } from 'react-icons/fa';

// TextInput 컴포넌트 정의
// width, height, withIcon, style 등의 props를 받아 유연하게 동작
export default function TextInput({
                                      width = 232,      // 입력창 기본 가로길이 (디자인 가이드 기준)
                                      height = 43,      // 입력창 기본 높이 (디자인 가이드 기준)
                                      withIcon = false, // 돋보기 아이콘 표시 여부
                                      style,            // 외부에서 추가로 전달할 inline style
                                      ...props          // placeholder, aria-label 등 나머지 props
                                  }) {
    // 원형 테두리를 만들기 위한 반지름 계산
    const radius = Math.round(height / 2);

    return (
        // 입력창 전체 wrapper (input + icon 포함)
        <div
            style={{
                width,                     // 너비
                height,                    // 높이
                border: '1px solid #ccc',  // 기본 테두리
                borderRadius: radius,      // 둥근 모서리 (pill 형태)
                display: 'flex',           // 내부 정렬용 flex
                alignItems: 'center',      // 수직 가운데 정렬
                padding: '0 12px',         // 좌우 여백
                gap: 8,                    // 아이콘과 입력창 사이 간격
                boxSizing: 'border-box',   // padding 포함한 총 크기 계산
                ...style,                  // 추가 스타일 덮어쓰기 허용
            }}
        >
            {/* withIcon이 true일 때만 아이콘 렌더링 */}
            {withIcon && (
                <FaSearch
                    style={{ opacity: 0.6 }}   // 시각적 강조를 줄이기 위한 투명도
                    aria-hidden="true"         // 접근성: 스크린리더가 무시하도록 설정
                />
            )}

            {/* 실제 입력 필드 */}
            <input
                {...props}                      // placeholder, aria-label 등 전달받은 속성 적용
                style={{
                    flex: 1,                    // 남은 공간 모두 차지
                    border: 'none',             // 기본 input border 제거
                    outline: 'none',            // 포커스 시 외곽선 제거
                    fontSize: 14,               // 글자 크기
                    height: '100%',             // 부모 높이에 맞춤
                    background: 'transparent',  // 투명 배경 (wrapper 색상과 통일)
                }}
            />
        </div>
    );
}