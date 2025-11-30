// src/pages/order/OrderAddressSelectPanel.jsx
import React, { useMemo, useState } from "react";

const MOCK_ADDRESSES = [
    {
        id: 1,
        address_name: "집",
        recipient: "공용USER",
        phone: "010-0000-0000",
        postal_code: "01234",
        address: "서울시 강남구 테헤란로 123 101동 1001호",
        detail_address: "",
        is_default: true,
    },
    {
        id: 2,
        address_name: "회사",
        recipient: "공용USER",
        phone: "010-1111-2222",
        postal_code: "04567",
        address: "서울시 중구 세종대로 45",
        detail_address: "10층",
        is_default: false,
    },
];

export default function OrderAddressSelectPanel({
                                                    currentAddress,
                                                    onChangeAddress,
                                                    onClose,
                                                }) {
    const [addresses, setAddresses] = useState(MOCK_ADDRESSES);

    // 현재 주소 기준 선택 상태
    const initialId = useMemo(() => {
        const found = addresses.find(
            (a) =>
                a.postal_code === currentAddress.postal_code &&
                a.address === currentAddress.address &&
                a.detail_address === currentAddress.detail_address
        );
        return found?.id ?? addresses[0]?.id;
    }, [addresses, currentAddress]);

    const [selectedId, setSelectedId] = useState(initialId);

    const [newAddr, setNewAddr] = useState({
        label: "",
        recipient: "",
        phone: "",
        postal_code: "",
        address: "",
        detail_address: "",
        is_default: false,
    });

    const handleChangeNew = (key, value) => {
        setNewAddr((prev) => ({ ...prev, [key]: value }));
    };

    const handleApplySelected = () => {
        const target = addresses.find((a) => a.id === selectedId);
        if (!target) {
            alert("배송지를 선택해 주세요.");
            return;
        }
        onChangeAddress(target);
    };

    const handleDelete = (id) => {
        if (!window.confirm("해당 배송지를 삭제하시겠습니까?")) return;
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        if (selectedId === id) {
            const remain = addresses.filter((a) => a.id !== id);
            if (remain.length > 0) setSelectedId(remain[0].id);
        }
    };

    const handleSaveNew = () => {
        if (!newAddr.label || !newAddr.recipient || !newAddr.phone) {
            alert("배송지 이름, 수령인, 연락처는 필수입니다.");
            return;
        }

        const nextId =
            addresses.reduce((max, a) => Math.max(max, a.id), 0) + 1;

        let nextList = addresses;

        // 기본 배송지로 지정 시 기존 기본 해제
        if (newAddr.is_default) {
            nextList = addresses.map((a) => ({ ...a, is_default: false }));
        }

        const created = { ...newAddr, id: nextId };
        const merged = [...nextList, created];

        setAddresses(merged);
        setNewAddr({
            label: "",
            recipient: "",
            phone: "",
            postal_code: "",
            address: "",
            detail_address: "",
            is_default: false,
        });
        setSelectedId(nextId);

        alert("새 배송지가 추가되었습니다.");
    };

    return (
        <div className="order-address-panel">
            {/* 상단: 배송지 목록 */}
            <div className="order-address-panel-header">
                <h3>배송지 목록</h3>
                <span className="order-address-count">총 {addresses.length}개</span>
            </div>

            <div className="order-address-list">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={
                            "order-address-item" +
                            (addr.id === selectedId ? " order-address-item--active" : "")
                        }
                    >
                        <label className="order-address-radio">
                            <input
                                type="radio"
                                checked={addr.id === selectedId}
                                onChange={() => setSelectedId(addr.id)}
                            />
                            <div className="order-address-text">
                                <div className="order-address-line-top">
                                    <span className="order-addr-label">{addr.label}</span>
                                    <span className="order-addr-recipient">
                    {addr.recipient} {addr.phone}
                  </span>
                                    {addr.is_default && (
                                        <span className="order-addr-badge">기본 배송지</span>
                                    )}
                                </div>
                                <div className="order-address-line-bottom">
                                    ({addr.postal_code}) {addr.address} {addr.detail_address}
                                </div>
                            </div>
                        </label>

                        <div className="order-address-actions">
                            {/* 수정은 나중에 구현 */}
                            <button
                                type="button"
                                className="order-addr-action-btn order-addr-delete"
                                onClick={() => handleDelete(addr.id)}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 적용/닫기 버튼 */}
            <div className="order-address-panel-actions">
                <button
                    type="button"
                    className="order-address-btn order-address-btn-ghost"
                    onClick={onClose}
                >
                    닫기
                </button>
                <button
                    type="button"
                    className="order-address-btn"
                    onClick={handleApplySelected}
                >
                    선택한 배송지 적용
                </button>
            </div>

            {/* 새 배송지 추가 */}
            <div className="order-address-add">
                <h4>새 배송지 추가</h4>

                <div className="order-address-form-grid">
                    <input
                        className="order-address-input"
                        placeholder="배송지 이름 (집 / 회사 등)"
                        value={newAddr.label}
                        onChange={(e) => handleChangeNew("label", e.target.value)}
                    />
                    <input
                        className="order-address-input"
                        placeholder="수령인 이름"
                        value={newAddr.recipient}
                        onChange={(e) => handleChangeNew("recipient", e.target.value)}
                    />
                    <input
                        className="order-address-input"
                        placeholder="연락처"
                        value={newAddr.phone}
                        onChange={(e) => handleChangeNew("phone", e.target.value)}
                    />
                    <input
                        className="order-address-input"
                        placeholder="우편번호"
                        value={newAddr.postal_code}
                        onChange={(e) =>
                            handleChangeNew("postal_code", e.target.value)
                        }
                    />
                    <input
                        className="order-address-input order-address-input-full"
                        placeholder="도로명 주소"
                        value={newAddr.address}
                        onChange={(e) => handleChangeNew("address", e.target.value)}
                    />
                    <input
                        className="order-address-input order-address-input-full"
                        placeholder="상세 주소 (동/호수 등)"
                        value={newAddr.detail_address}
                        onChange={(e) =>
                            handleChangeNew("detail_address", e.target.value)
                        }
                    />
                </div>

                <label className="order-address-default-check">
                    <input
                        type="checkbox"
                        checked={newAddr.is_default}
                        onChange={(e) =>
                            handleChangeNew("is_default", e.target.checked)
                        }
                    />
                    이 주소를 기본 배송지로 사용
                </label>

                <div className="order-address-panel-actions">
                    <button
                        type="button"
                        className="order-address-btn order-address-btn-ghost"
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="order-address-btn"
                        onClick={handleSaveNew}
                    >
                        저장하기
                    </button>
                </div>
            </div>
        </div>
    );
}