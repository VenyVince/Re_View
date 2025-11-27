// src/pages/order/OrderCardPaymentSection.jsx
import React, { useEffect, useState } from "react";

export default function OrderCardPaymentSection({
                                                    amount,
                                                    savedCards = [],
                                                    onValidityChange,
                                                }) {
    // mode: "saved" = 등록 카드 사용, "new" = 새 카드 입력
    const [mode, setMode] = useState(
        savedCards.length > 0 ? "saved" : "new"
    );
    const [selectedCardId, setSelectedCardId] = useState(
        savedCards.find((c) => c.is_default)?.id || savedCards[0]?.id || null
    );

    // 새 카드 입력용 state
    const [cardNumber, setCardNumber] = useState(["", "", "", ""]);
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [holder, setHolder] = useState("");
    const [installment, setInstallment] = useState("0");
    const [saveCard, setSaveCard] = useState(false);

    const onlyDigits = (value) => value.replace(/[^0-9]/g, "");

    const handleCardNumberChange = (idx, value) => {
        const clean = onlyDigits(value).slice(0, 4);
        setCardNumber((prev) => {
            const next = [...prev];
            next[idx] = clean;
            return next;
        });
    };

    const handleExpiryChange = (value) => {
        const clean = onlyDigits(value).slice(0, 4); // MMYY
        let formatted = clean;
        if (clean.length >= 3) {
            formatted = `${clean.slice(0, 2)}/${clean.slice(2)}`;
        }
        setExpiry(formatted);
    };

    const handleCvcChange = (value) => {
        setCvc(onlyDigits(value).slice(0, 3));
    };

    // 유효성 판단
    const isNewCardValid =
        cardNumber.every((g) => g.length === 4) &&
        expiry.length === 5 &&
        cvc.length === 3 &&
        holder.trim().length > 0;

    const isSavedCardValid = mode === "saved" && !!selectedCardId;

    useEffect(() => {
        if (onValidityChange) {
            onValidityChange(
                mode === "saved" ? isSavedCardValid : isNewCardValid
            );
        }
    }, [mode, isNewCardValid, isSavedCardValid, onValidityChange]);

    const handleSelectMode = (nextMode) => {
        setMode(nextMode);
    };

    return (
        <section className="order-card">
            <h2 className="order-card-title">결제 수단</h2>

            {/* 탭 비슷한 토글 */}
            <div className="pay-mode-toggle">
                <button
                    type="button"
                    className={
                        "pay-mode-btn" + (mode === "saved" ? " pay-mode-btn--active" : "")
                    }
                    onClick={() => handleSelectMode("saved")}
                    disabled={savedCards.length === 0}
                >
                    등록된 카드
                </button>
                <button
                    type="button"
                    className={
                        "pay-mode-btn" + (mode === "new" ? " pay-mode-btn--active" : "")
                    }
                    onClick={() => handleSelectMode("new")}
                >
                    새 카드 입력
                </button>
            </div>

            {/* --- 등록된 카드 리스트 --- */}
            {mode === "saved" && savedCards.length > 0 && (
                <div className="pay-card-list">
                    {savedCards.map((card) => (
                        <label
                            key={card.id}
                            className={
                                "pay-card-item" +
                                (selectedCardId === card.id ? " pay-card-item--active" : "")
                            }
                        >
                            <input
                                type="radio"
                                name="saved-card"
                                className="pay-card-radio"
                                checked={selectedCardId === card.id}
                                onChange={() => setSelectedCardId(card.id)}
                            />
                            <div className="pay-card-main">
                                <div className="pay-card-line1">
                  <span className="pay-card-nickname">
                    {card.nickname || card.brand}
                  </span>
                                    {card.is_default && (
                                        <span className="pay-card-badge">기본</span>
                                    )}
                                </div>
                                <div className="pay-card-line2">
                                    <span className="pay-card-mask">{card.masked_number}</span>
                                    <span className="pay-card-expiry">유효기간 {card.expiry}</span>
                                </div>
                            </div>
                        </label>
                    ))}
                    {savedCards.length === 0 && (
                        <p className="pay-empty-text">등록된 카드가 없습니다.</p>
                    )}
                </div>
            )}

            {/* --- 새 카드 입력 폼 --- */}
            {mode === "new" && (
                <div className="pay-new-card">
                    <div className="pay-field-group">
                        <label className="pay-label">카드 번호</label>
                        <div className="pay-card-number">
                            {cardNumber.map((v, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    inputMode="numeric"
                                    className="pay-input pay-card-num-input"
                                    value={v}
                                    onChange={(e) =>
                                        handleCardNumberChange(idx, e.target.value)
                                    }
                                    maxLength={4}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pay-field-row">
                        <div className="pay-field-group">
                            <label className="pay-label">유효기간 (MM/YY)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                className="pay-input"
                                value={expiry}
                                onChange={(e) => handleExpiryChange(e.target.value)}
                                placeholder="MM/YY"
                                maxLength={5}
                            />
                        </div>
                        <div className="pay-field-group">
                            <label className="pay-label">CVC</label>
                            <input
                                type="password"
                                inputMode="numeric"
                                className="pay-input"
                                value={cvc}
                                onChange={(e) => handleCvcChange(e.target.value)}
                                maxLength={3}
                                placeholder="***"
                            />
                        </div>
                    </div>

                    <div className="pay-field-row">
                        <div className="pay-field-group">
                            <label className="pay-label">카드 소유자 이름</label>
                            <input
                                type="text"
                                className="pay-input"
                                value={holder}
                                onChange={(e) => setHolder(e.target.value)}
                                placeholder="예: 홍길동"
                            />
                        </div>
                        <div className="pay-field-group">
                            <label className="pay-label">할부 선택</label>
                            <select
                                className="pay-select"
                                value={installment}
                                onChange={(e) => setInstallment(e.target.value)}
                            >
                                <option value="0">일시불</option>
                                <option value="3">3개월</option>
                                <option value="6">6개월</option>
                                <option value="12">12개월</option>
                            </select>
                        </div>
                    </div>

                    <label className="pay-save-card">
                        <input
                            type="checkbox"
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                        />
                        이 카드 정보를 다음 결제에서도 사용
                    </label>
                </div>
            )}

            <p className="pay-help">
                현재는 테스트용 UI입니다. 실제 결제는 PG 연동 후 처리됩니다. <br />
                결제 예정 금액:{" "}
                <strong>{amount.toLocaleString("ko-KR")}원</strong>
            </p>
        </section>
    );
}