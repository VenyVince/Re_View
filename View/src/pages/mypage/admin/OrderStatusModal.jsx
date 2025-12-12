import React from "react";
import styled from "styled-components";

export default function OrderStatusModal({ visible, onClose, currentStatus, onSave }) {

    if (!visible) return null;

    const statusOptions = [
        { value: "completed", label: "주문완료" },
        { value: "in_delivery", label: "배송중" },
        { value: "delivered", label: "배송완료" },
    ];

    return (
        <Overlay>
            <ModalBox>
                <Title>주문 상태 변경</Title>

                <StatusList>
                    {statusOptions.map((item) => (
                        <label key={item.value} className="status-option">
                            <input
                                type="radio"
                                name="order-status"
                                value={item.value}
                                defaultChecked={currentStatus === item.value}
                            />
                            {item.label}
                        </label>
                    ))}
                </StatusList>

                <ButtonRow>
                    <CancelButton onClick={onClose}>취소</CancelButton>
                    <SaveButton
                        onClick={() => {
                            const checked = document.querySelector("input[name='order-status']:checked")?.value;
                            onSave(checked);
                        }}
                    >
                        저장
                    </SaveButton>
                </ButtonRow>
            </ModalBox>
        </Overlay>
    );
}


/* -------------------- Styled Components -------------------- */

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

const ModalBox = styled.div`
    width: 360px;
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
`;

const Title = styled.h3`
    margin: 0 0 20px;
    font-size: 18px;
    font-weight: 700;
`;

const StatusList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;

    .status-option {
        font-size: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;

const ButtonRow = styled.div`
    margin-top: 25px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const CancelButton = styled.button`
    padding: 8px 14px;
    background: #ddd;
    border-radius: 6px;
    border: none;
`;

const SaveButton = styled.button`
    padding: 8px 14px;
    background: #444;
    border-radius: 6px;
    border: none;
    font-weight: 600;
    color: #f0f0f0;
    &:hover {
        background: #333;
    }
`;
