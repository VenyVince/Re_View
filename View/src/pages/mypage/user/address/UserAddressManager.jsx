// src/pages/mypage/user/UserAddressManager.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import addressDummy from "../dummy/addressDummy";
import "./UserAddress.css";

export default function UserAddressManager() {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState(addressDummy);
    const initialForm = {
        address_name: "",
        recipient: "",
        phone: "",
        postal_code: "",
        address: "",
        detail_address: "",
        is_default: false,
    };
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId !== null) {
            // Edit existing address
            setAddresses((prev) => {
                let updated = prev.map((a) => {
                    if (a.address_id === editingId) {
                        // If is_default, set all others to false, this to true
                        return {
                            ...a,
                            ...form,
                            address_id: a.address_id,
                            user_id: a.user_id,
                            is_default: form.is_default,
                        };
                    }
                    return form.is_default
                        ? { ...a, is_default: false }
                        : a;
                });
                return updated;
            });
        } else {
            // Add new address
            const newAddress = {
                address_id: Date.now(),
                user_id: 1,
                ...form,
            };
            setAddresses((prev) => [
                ...(form.is_default
                    ? prev.map((a) => ({ ...a, is_default: false }))
                    : prev),
                newAddress,
            ]);
        }
        // 저장/수정 후 주문배송 관리 페이지로
        navigate("/mypage");
        // 폼 리셋 및 편집 종료
        setEditingId(null);
        setForm(initialForm);
    };
    // Edit handler
    const handleEdit = (addr) => {
        setEditingId(addr.address_id);
        setForm({
            address_name: addr.address_name,
            recipient: addr.recipient,
            phone: addr.phone,
            postal_code: addr.postal_code,
            address: addr.address,
            detail_address: addr.detail_address,
            is_default: addr.is_default,
        });
    };

    const handleSetDefault = (id) => {
        setAddresses((prev) =>
            prev.map((a) => ({
                ...a,
                is_default: a.address_id === id,
            }))
        );
    };

    const handleDelete = (id) => {
        if (!window.confirm("해당 배송지를 삭제하시겠습니까?")) return;
        setAddresses((prev) => prev.filter((a) => a.address_id !== id));
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm(initialForm);
        navigate("/mypage");
    };

    return (
        <div className="address-manager">
            {/* 상단 리스트 */}
            <section className="address-card">
                <div className="address-list-header">
                    <h3 className="address-section-title">배송지 목록</h3>
                    <span className="address-count">
                        총 <strong>{addresses.length}</strong>개
                    </span>
                </div>

                <div className="address-list">
                    {addresses.map((addr) => (
                        <div
                            key={addr.address_id}
                            className={`address-item ${
                                addr.is_default ? "address-item-default" : ""
                            }`}
                        >
                            <div className="address-radio-area">
                                <input
                                    type="radio"
                                    name="selectedAddress"
                                    checked={addr.is_default}
                                    onChange={() => handleSetDefault(addr.address_id)}
                                />
                                <span className="address-type-tag">
                                    {addr.is_default ? "기본 배송지" : "배송지"}
                                </span>
                            </div>

                            <div className="address-info">
                                <div className="address-line1">
                                    <span className="address-name">
                                        {addr.address_name}
                                    </span>
                                    <span className="address-recipient">
                                        {addr.recipient} {addr.phone}
                                    </span>
                                </div>
                                <div className="address-line2">
                                    ({addr.postal_code}) {addr.address}{" "}
                                    {addr.detail_address}
                                </div>
                            </div>

                            <div className="address-actions">
                                <button
                                    type="button"
                                    className="address-edit-btn"
                                    onClick={() => handleEdit(addr)}
                                >
                                    수정
                                </button>
                                <button
                                    type="button"
                                    className="address-delete-btn"
                                    onClick={() => handleDelete(addr.address_id)}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 하단 폼 – 새 배송지 추가 */}
            <section className="address-card address-form-wrapper">
                <form className="address-form" onSubmit={handleSubmit}>
                    <h3 className="address-section-title address-form-title">
                        {editingId ? "배송지 수정" : "새 배송지 추가"}
                    </h3>

                    <div className="address-form-row">
                        <div className="address-form-field">
                            <label>배송지 이름</label>
                            <input
                                name="address_name"
                                value={form.address_name}
                                onChange={handleChange}
                                placeholder="집 / 회사 등"
                            />
                        </div>
                        <div className="address-form-field">
                            <label>수령인</label>
                            <input
                                name="recipient"
                                value={form.recipient}
                                onChange={handleChange}
                                placeholder="수령인 이름"
                            />
                        </div>
                    </div>

                    <div className="address-form-row">
                        <div className="address-form-field">
                            <label>연락처</label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="010-0000-0000"
                            />
                        </div>
                        <div className="address-form-field">
                            <label>우편번호</label>
                            <input
                                name="postal_code"
                                value={form.postal_code}
                                onChange={handleChange}
                                placeholder="01234"
                            />
                        </div>
                    </div>

                    <div className="address-form-field full-width">
                        <label>기본 주소</label>
                        <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="도로명 주소"
                        />
                    </div>

                    <div className="address-form-field full-width">
                        <label>상세 주소</label>
                        <input
                            name="detail_address"
                            value={form.detail_address}
                            onChange={handleChange}
                            placeholder="동/호수 등 상세 주소"
                        />
                    </div>

                    <label className="address-default-checkbox">
                        <input
                            type="checkbox"
                            name="is_default"
                            checked={form.is_default}
                            onChange={handleChange}
                        />
                        이 주소를 기본 배송지로 사용
                    </label>

                    <div className="address-form-actions">
                        <button
                            type="button"
                            className="address-cancel-btn"
                            onClick={handleCancel}
                        >
                            취소
                        </button>
                        <button type="submit" className="address-save-btn">
                            {editingId ? "수정 완료" : "저장하기"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}