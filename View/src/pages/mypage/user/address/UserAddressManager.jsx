// src/pages/mypage/user/address/UserAddressManager.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserAddress.css";

export default function UserAddressManager() {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const initialForm = {
        address_name: "",
        recipient_name: "",
        phone_number: "",
        postal_code: "",
        address: "",
        detail_address: "",
        is_default: false, // 프론트에서는 boolean, 전송 시 "0"/"1"으로 변환
    };

    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null); // 수정 중인 address_id
    const [showForm, setShowForm] = useState(false);  // 폼 열림 여부

    // ======================
    //  API: 배송지 목록 조회
    // ======================
    const fetchAddresses = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.get("/api/addresses", {
                withCredentials: true,
            });

            const data = Array.isArray(res.data) ? res.data : res.data?.addresses || [];

            // is_default: "1"/"0" → boolean으로 변환
            const normalized = data.map((a) => ({
                ...a,
                is_default: a.is_default === "1",
            }));

            setAddresses(normalized);
        } catch (e) {
            setError("배송지 목록을 불러오는 중 오류가 발생했어요.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // ======================
    //  공통: form 변경
    // ======================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // 폼/상태 초기화
    const resetFormState = () => {
        setEditingId(null);
        setForm(initialForm);
    };

    // ======================
    //  저장(추가/수정) 버튼
    // ======================
    const handleSubmit = async () => {
        if (!showForm) {
            if (addresses.length === 0) {
                alert("등록된 배송지가 없습니다.");
                return;
            }
            const selected = addresses.find((a) => a.is_default);
            if (!selected) {
                alert("기본으로 설정할 배송지를 선택해주세요.");
                return;
            }
            const payload = {
                address_name: selected.address_name,
                recipient_name: selected.recipient_name,
                phone_number: selected.phone_number,
                postal_code: selected.postal_code,
                address: selected.address,
                detail_address: selected.detail_address,
                is_default: "1",
            };
            try {
                await axios.patch(`/api/addresses/${selected.address_id}`, payload, {
                    withCredentials: true,
                });
                alert("기본 배송지가 변경되었습니다.");
                await fetchAddresses();
                navigate("/mypage");
            } catch (e) {
                alert("기본 배송지 변경 중 오류가 발생했습니다.");
            }
            return;
        }

        // 기존 추가/수정 로직
        if (!form.recipient_name || !form.phone_number || !form.address) {
            alert("수령인, 연락처, 기본 주소는 필수입니다.");
            return;
        }

        const payload = {
            address_name: form.address_name || undefined,
            recipient_name: form.recipient_name,
            phone_number: form.phone_number,
            postal_code: form.postal_code || "",
            address: form.address,
            detail_address: form.detail_address || "",
            is_default: form.is_default ? "1" : "0",
        };

        try {
            if (editingId !== null) {
                //️ 수정 모드 → PATCH /api/addresses/{address_id}
                await axios.patch(`/api/addresses/${editingId}`, payload, {
                    withCredentials: true,
                });
                alert("배송지가 수정되었습니다.");
            } else {
                // ➕ 새 배송지 추가 → POST /api/addresses
                await axios.post("/api/addresses", payload, {
                    withCredentials: true,
                });
                alert("배송지가 추가되었습니다.");
            }

            await fetchAddresses();
            resetFormState();
            setShowForm(false);
            navigate("/mypage");
        } catch (e) {
            alert("배송지 저장 중 오류가 발생했습니다.");
        }
    };

    // ======================
    //  수정 버튼
    // ======================
    const handleEdit = (addr) => {
        setEditingId(addr.address_id);
        setForm({
            address_name: addr.address_name || "",
            recipient_name: addr.recipient_name || "",
            phone_number: addr.phone_number || "",
            postal_code: addr.postal_code || "",
            address: addr.address || "",
            detail_address: addr.detail_address || "",
            is_default: !!addr.is_default,
        });
        setShowForm(true);
    };

    // ======================
    //  기본 배송지 선택 (radio)
    // ======================
    const handleSetDefault = (id) => {
        setAddresses((prev) =>
            prev.map((a) => ({
                ...a,
                is_default: a.address_id === id,
            }))
        );
    };

    // ======================
    //  삭제 버튼
    // ======================
    const handleDelete = async (id) => {
        if (!window.confirm("해당 배송지를 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`/api/addresses/${id}`, {
                withCredentials: true,
            });
            setAddresses((prev) => prev.filter((a) => a.address_id !== id));
        } catch (e) {
            alert("배송지 삭제 중 오류가 발생했습니다.");
        }
    };

    // ======================
    //  새 배송지 추가 버튼
    // ======================
    const handleClickNew = () => {
        resetFormState();
        setShowForm(true);
    };

    // ======================
    //  취소 버튼
    // ======================
    const handleCancel = () => {
        resetFormState();
        setShowForm(false);
        navigate("/mypage");
    };

    return (
        <div className="address-manager">
            {/* 상단 리스트 카드 */}
            <section className="address-card">
                <div className="address-list-header">
                    <div className="address-list-header-left">
                        <h3 className="address-section-title">배송지 목록</h3>
                        <span className="address-count">
                            총 <strong>{addresses.length}</strong>개
                        </span>
                    </div>

                    <button
                        type="button"
                        className="address-add-btn"
                        onClick={handleClickNew}
                    >
                        새 배송지 추가
                    </button>
                </div>

                {loading && (
                    <p className="address-helper-text">배송지 정보를 불러오는 중입니다...</p>
                )}
                {error && <p className="address-error-text">{error}</p>}

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
                                        {addr.recipient_name} {addr.phone_number}
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

                    {!loading && addresses.length === 0 && !error && (
                        <p className="address-helper-text">등록된 배송지가 없습니다.</p>
                    )}
                </div>
            </section>

            {/* 하단 폼 카드 – 추가/수정 공통 */}
            {showForm && (
                <section className="address-card address-form-wrapper">
                    <form className="address-form">
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
                                    name="recipient_name"
                                    value={form.recipient_name}
                                    onChange={handleChange}
                                    placeholder="수령인 이름"
                                />
                            </div>
                        </div>

                        <div className="address-form-row">
                            <div className="address-form-field">
                                <label>연락처</label>
                                <input
                                    name="phone_number"
                                    value={form.phone_number}
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
                    </form>
                </section>
            )}
            {/* 폼 바깥 버튼 영역 */}
            <div className="address-form-footer">
                <button
                    type="button"
                    className="address-cancel-btn"
                    onClick={handleCancel}
                >
                    취소
                </button>
                <button
                    type="button"
                    className="address-save-btn"
                    onClick={handleSubmit}
                >
                    {editingId ? "수정 완료" : "저장하기"}
                </button>
            </div>
        </div>

    );
}