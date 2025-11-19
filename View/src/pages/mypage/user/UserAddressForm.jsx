// src/pages/mypage/user/UserAddressForm.jsx
import React from "react";
import "./UserDashboard.css"; // 스타일 재사용

export default function UserAddressForm({
                                            form,
                                            onChangeField,
                                            onSubmit,
                                            onCancel,
                                        }) {
    return (
        <form className="delivery-form" onSubmit={onSubmit}>
            <h5 className="delivery-form-title">
                {form.address_id ? "배송지 수정" : "새 배송지 추가"}
            </h5>

            <div className="delivery-form-row">
                <label>
                    배송지 이름
                    <input
                        type="text"
                        name="address_name"
                        value={form.address_name}
                        onChange={onChangeField}
                        placeholder="집 / 회사 등"
                    />
                </label>

                <label>
                    수령인
                    <input
                        type="text"
                        name="recipient"
                        value={form.recipient}
                        onChange={onChangeField}
                        required
                    />
                </label>
            </div>

            <div className="delivery-form-row">
                <label>
                    연락처
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={onChangeField}
                        placeholder="010-0000-0000"
                        required
                    />
                </label>

                <label>
                    우편번호
                    <input
                        type="text"
                        name="postal_code"
                        value={form.postal_code}
                        onChange={onChangeField}
                        placeholder="01234"
                        required
                    />
                </label>
            </div>

            <div className="delivery-form-row">
                <label className="delivery-form-full">
                    주소
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={onChangeField}
                        required
                    />
                </label>
            </div>

            <div className="delivery-form-row">
                <label className="delivery-form-full">
                    상세 주소
                    <input
                        type="text"
                        name="detail_address"
                        value={form.detail_address}
                        onChange={onChangeField}
                    />
                </label>
            </div>

            <div className="delivery-form-bottom">
                <label className="delivery-default-checkbox">
                    <input
                        type="checkbox"
                        name="is_default"
                        checked={form.is_default}
                        onChange={onChangeField}
                    />
                    <span>이 주소를 기본 배송지로 사용</span>
                </label>

                <div className="delivery-form-buttons">
                    <button
                        type="button"
                        className="delivery-cancel-btn"
                        onClick={onCancel}
                    >
                        취소
                    </button>
                    <button type="submit" className="delivery-save-btn">
                        저장하기
                    </button>
                </div>
            </div>
        </form>
    );
}