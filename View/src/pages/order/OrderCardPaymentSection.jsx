// src/pages/order/OrderCardPaymentSection.jsx
import React, { useEffect, useState } from "react";

/**
 * props:
 * - amount: 최종 결제 금액
 * - cards: [{ payment_id, card_company, card_number }]
 * - cardsLoading: 카드 목록 로딩 여부
 * - cardsError: 카드 목록 에러 메시지
 * - selectedPaymentId: 현재 선택된 결제수단 ID
 * - onChangeSelected(paymentId)
 * - onCreateCard({ card_company, card_number })
 * - onUpdateCard(paymentId, { card_company, card_number })
 * - onDeleteCard(paymentId)
 */
export default function OrderCardPaymentSection({
                                                    amount,
                                                    cards,
                                                    cardsLoading,
                                                    cardsError,
                                                    selectedPaymentId,
                                                    onChangeSelected,
                                                    onCreateCard,
                                                    onUpdateCard,
                                                    onDeleteCard,
                                                }) {
    const [form, setForm] = useState({
        card_company: "",
        card_number: "",
    });
    const [showForm, setShowForm] = useState(false);

    // 카드 목록이 바뀔 때, 선택된 카드가 삭제되었으면 선택 해제/재선택
    useEffect(() => {
        if (!cards || cards.length === 0) {
            if (selectedPaymentId != null && onChangeSelected) {
                onChangeSelected(null);
            }
            setShowForm(false);
            return;
        }

        const exists = cards.some((c) => c.payment_id === selectedPaymentId);
        if (!exists) {
            // 선택된 카드가 없으면 첫 번째 카드로 기본 선택
            if (onChangeSelected) {
                onChangeSelected(cards[0].payment_id);
            }
        }
    }, [cards]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm({
            card_company: "",
            card_number: "",
        });
        setShowForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.card_company || !form.card_number) {
            alert("카드사와 카드 번호를 모두 입력해 주세요.");
            return;
        }

        const payload = {
            card_company: form.card_company,
            card_number: form.card_number,
        };

        onCreateCard && onCreateCard(payload);

        resetForm();
    };

    const handleDeleteClick = (paymentId) => {
        onDeleteCard && onDeleteCard(paymentId);
    };

    const handleSelectCard = (paymentId) => {
        onChangeSelected && onChangeSelected(paymentId);
    };

    return (
        <section className="order-card">
            <div className="order-card-header">
                <h2 className="order-card-title">결제수단 선택</h2>
                <button
                    type="button"
                    className="order-link-btn order-payment-add-btn"
                    onClick={() => setShowForm((prev) => !prev)}
                >
                    새 결제수단 추가
                </button>
            </div>

            <div className="order-payment-body">
                {cardsLoading ? (
                    <p>결제수단을 불러오는 중입니다...</p>
                ) : cardsError ? (
                    <p className="order-payment-error">{cardsError}</p>
                ) : !cards || cards.length === 0 ? (
                    <p>등록된 결제수단이 없습니다. 새 결제수단 추가 버튼을 눌러 등록해 주세요.</p>
                ) : (
                    <ul className="order-payment-card-list">
                        {cards.map((card) => (
                            <li
                                key={card.payment_id}
                                className={
                                    "order-payment-card-item" +
                                    (card.payment_id === selectedPaymentId
                                        ? " order-payment-card-item--selected"
                                        : "")
                                }
                            >
                                <label className="order-payment-card-main">
                                    <input
                                        type="radio"
                                        name="selectedPayment"
                                        checked={card.payment_id === selectedPaymentId}
                                        onChange={() => handleSelectCard(card.payment_id)}
                                    />
                                    <div className="order-payment-card-text">
                                        <div className="order-payment-card-title">
                                            <span className="order-payment-card-company">
                                                {card.card_company}
                                            </span>
                                            {card.payment_id === selectedPaymentId && (
                                                <span className="order-payment-card-badge">
                                                    선택
                                                </span>
                                            )}
                                        </div>
                                        <div className="order-payment-card-number">
                                            {card.card_number}
                                        </div>
                                    </div>
                                </label>

                                <div className="order-payment-card-actions">
                                    <button
                                        type="button"
                                        className="order-payment-card-delete-btn"
                                        onClick={() =>
                                            handleDeleteClick(card.payment_id)
                                        }
                                    >
                                        삭제
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {showForm && (
                <>
                    <div className="order-payment-divider" />

                    <form className="order-payment-form" onSubmit={handleSubmit}>
                        <h3 className="order-payment-form-title">새 결제수단 등록</h3>

                        <div className="order-payment-form-row">
                            <div className="order-payment-form-field">
                                <label>카드사</label>
                                <input
                                    name="card_company"
                                    value={form.card_company}
                                    onChange={handleChange}
                                    placeholder="예: 신한카드"
                                />
                            </div>
                        </div>

                        <div className="order-payment-form-row">
                            <div className="order-payment-form-field">
                                <label>카드 번호</label>
                                <input
                                    name="card_number"
                                    value={form.card_number}
                                    onChange={handleChange}
                                    placeholder="예: 1234-5678-****-****"
                                />
                            </div>
                        </div>

                        <div className="order-payment-form-footer">
                            <button
                                type="button"
                                className="order-payment-form-reset-btn"
                                onClick={resetForm}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="order-payment-form-submit-btn"
                            >
                                등록하기
                            </button>
                        </div>
                    </form>
                </>
            )}

            <div className="order-payment-amount">
                <span>결제 예정 금액</span>
                <span className="order-payment-amount-value">
                    {amount.toLocaleString("ko-KR", {
                        maximumFractionDigits: 0,
                    })}
                    원
                </span>
            </div>
        </section>
    );
}