// src/pages/mypage/user/UserDeliveryPage.jsx
import React, { useMemo, useState } from "react";
import "./UserDashboard.css";
import UserMyPageLayout from "./UserMyPageLayout";
import addressDummy from "./dummy/addressDummy";
import UserAddressForm from "./UserAddressForm";

const EMPTY_FORM = {
    address_id: null,
    user_id: 1,
    address_name: "",
    recipient: "",
    phone: "",
    postal_code: "",
    address: "",
    detail_address: "",
    is_default: false,
};

export default function UserDeliveryPage() {
    // ✅ 소프트코딩된 더미 데이터 사용
    const [addresses, setAddresses] = useState(addressDummy);
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isEditing, setIsEditing] = useState(false);

    const defaultAddress = useMemo(
        () => addresses.find((a) => a.is_default),
        [addresses]
    );

    // ── 기본 영역 ────────────────────────────────
    const handleClickChange = () => {
        setIsManageOpen((prev) => !prev);
        // 패널 열리면서 폼은 닫아두기
        setIsEditing(false);
        setForm(EMPTY_FORM);
    };

    // ── 배송지 관리/폼 공통 ──────────────────────
    const openCreateForm = () => {
        setForm(EMPTY_FORM);
        setIsEditing(true);
    };

    const openEditForm = (addr) => {
        setForm({ ...addr });
        setIsEditing(true);
    };

    const closeForm = () => {
        setForm(EMPTY_FORM);
        setIsEditing(false);
    };

    const handleSetDefault = (address_id) => {
        setAddresses((prev) =>
            prev.map((a) => ({
                ...a,
                is_default: a.address_id === address_id,
            }))
        );
    };

    const handleDeleteAddress = (address_id) => {
        if (!window.confirm("해당 배송지를 삭제하시겠습니까?")) return;
        setAddresses((prev) => prev.filter((a) => a.address_id !== address_id));
    };

    const handleChangeField = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        if (!form.recipient || !form.phone || !form.postal_code || !form.address) {
            alert("수령인, 연락처, 우편번호, 주소는 필수 입력 항목입니다.");
            return;
        }

        setAddresses((prev) => {
            let next = [...prev];

            if (!form.address_id) {
                // 새로 추가
                const newId =
                    (prev.length ? Math.max(...prev.map((a) => a.address_id)) : 0) + 1;
                const newAddr = { ...form, address_id: newId };

                if (newAddr.is_default) {
                    next = next.map((a) => ({ ...a, is_default: false }));
                }

                return [...next, newAddr];
            }

            // 수정
            next = next.map((a) => (a.address_id === form.address_id ? form : a));

            if (form.is_default) {
                next = next.map((a) => ({
                    ...a,
                    is_default: a.address_id === form.address_id,
                }));
            }

            return next;
        });

        // TODO: 여기서 실제 API 호출(PATCH/POST) 연결
        closeForm();
    };

    return (
        <UserMyPageLayout>
            <section className="mypage-section">
                <h3 className="mypage-section-title">주문 배송 관리</h3>

                {/* 기본 배송지 박스 */}
                <div className="delivery-default-box">
                    <div className="delivery-default-info">
                        <div className="delivery-default-label">기본 배송지</div>
                        {defaultAddress ? (
                            <>
                                <div className="delivery-default-recipient">
                  <span className="delivery-chip">
                    {defaultAddress.address_name || "기본"}
                  </span>
                                    <strong>{defaultAddress.recipient}</strong>
                                    <span className="delivery-default-phone">
                    {defaultAddress.phone}
                  </span>
                                </div>
                                <div className="delivery-default-address">
                                    ({defaultAddress.postal_code}){" "}
                                    {defaultAddress.address} {defaultAddress.detail_address}
                                </div>
                            </>
                        ) : (
                            <div className="delivery-default-empty">
                                등록된 기본 배송지가 없습니다. 배송지를 추가해주세요.
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="delivery-edit-btn"
                        onClick={handleClickChange}
                    >
                        {isManageOpen ? "닫기" : "변경하기"}
                    </button>
                </div>

                {/* 주문 요약 카드 그대로 유지 */}
                <div className="order-summary-cards">
                    <div className="order-summary-card">
                        <div className="label">주문완료</div>
                        <div className="value">0</div>
                    </div>
                    <div className="order-summary-card">
                        <div className="label">배송중</div>
                        <div className="value">0</div>
                    </div>
                    <div className="order-summary-card">
                        <div className="label">배송완료</div>
                        <div className="value">0</div>
                    </div>
                </div>

                {/* 배송지 관리 패널 + 폼 */}
                {isManageOpen && (
                    <div className="delivery-manage-panel">
                        <div className="delivery-manage-header">
                            <h4>배송지 관리</h4>
                            <button
                                type="button"
                                className="delivery-add-btn"
                                onClick={openCreateForm}
                            >
                                + 새 배송지 추가
                            </button>
                        </div>

                        {/* 리스트 */}
                        <div className="delivery-address-list">
                            {addresses.map((addr) => (
                                <div key={addr.address_id} className="delivery-address-card">
                                    <div className="delivery-address-left">
                                        <label className="delivery-radio">
                                            <input
                                                type="radio"
                                                name="defaultAddress"
                                                checked={!!addr.is_default}
                                                onChange={() => handleSetDefault(addr.address_id)}
                                            />
                                            <span>기본 배송지</span>
                                        </label>

                                        <div className="delivery-address-main">
                                            <div className="delivery-address-header">
                        <span className="delivery-chip">
                          {addr.address_name || "기본"}
                        </span>
                                                <strong>{addr.recipient}</strong>
                                                <span className="delivery-address-phone">
                          {addr.phone}
                        </span>
                                            </div>
                                            <div className="delivery-address-line">
                                                ({addr.postal_code}) {addr.address}{" "}
                                                {addr.detail_address}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="delivery-address-actions">
                                        <button
                                            type="button"
                                            className="delivery-text-btn"
                                            onClick={() => openEditForm(addr)}
                                        >
                                            수정
                                        </button>
                                        <button
                                            type="button"
                                            className="delivery-text-btn danger"
                                            onClick={() => handleDeleteAddress(addr.address_id)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {addresses.length === 0 && (
                                <div className="delivery-address-empty">
                                    등록된 배송지가 없습니다. 새 배송지를 추가해 주세요.
                                </div>
                            )}
                        </div>

                        {/* 폼: 분리된 컴포넌트 사용 */}
                        {isEditing && (
                            <UserAddressForm
                                form={form}
                                onChangeField={handleChangeField}
                                onSubmit={handleSubmitForm}
                                onCancel={closeForm}
                            />
                        )}
                    </div>
                )}
            </section>
        </UserMyPageLayout>
    );
}