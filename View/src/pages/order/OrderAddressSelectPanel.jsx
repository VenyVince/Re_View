// src/pages/order/OrderAddressSelectPanel.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "api/axiosClient";

export default function OrderAddressSelectPanel({
                                                    currentAddress,      // { postal_code, address, detail_address, ... }
                                                    onChangeAddress,     // 선택 적용 시 부모에 전달
                                                    onClose,
                                                }) {
    const [addresses, setAddresses] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // 폼 상태 (추가 + 수정 공용)
    const emptyForm = {
        address_name: "",
        recipient: "",
        phone: "",
        postal_code: "",
        address: "",
        detail_address: "",
        is_default: false,
    };
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null); // null이면 새 배송지, 숫자면 수정모드

    // ===== DTO ↔ 프론트 데이터 매핑 =====
    const mapDtoToAddress = (dto) => ({
        id: dto.address_id,
        address_name: dto.address_name,
        recipient: dto.recipient_name,
        phone: dto.phone_number,
        postal_code: dto.postal_code,
        address: dto.address,
        detail_address: dto.detail_address,
        is_default: dto.is_default === "1",
    });

    const mapFormToDto = (data, extra = {}) => ({
        address_id: extra.address_id ?? undefined,
        // user_id는 서버에서 Security_Util로 채우므로 보낼 필요 없음
        address_name: data.address_name || "배송지",
        recipient_name: data.recipient,
        postal_code: data.postal_code,
        address: data.address,
        detail_address: data.detail_address,
        phone_number: data.phone,
        is_default: data.is_default ? "1" : "0",
    });

    // ===== 배송지 목록 조회 =====
    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get("/api/addresses");

            const list = Array.isArray(res.data) ? res.data : [];

            const mapped = list.map(mapDtoToAddress);
            setAddresses(mapped);

            // 선택 기본값: 1) 현재 선택한 주소와 같은 것 → 2) 기본 배송지 → 3) 첫 번째
            if (mapped.length > 0) {
                let initial = null;

                if (currentAddress) {
                    initial = mapped.find(
                        (a) =>
                            a.postal_code === currentAddress.postal_code &&
                            a.address === currentAddress.address &&
                            a.detail_address === currentAddress.detail_address
                    );
                }

                if (!initial) {
                    initial =
                        mapped.find((a) => a.is_default) || mapped[0];
                }

                setSelectedId(initial.id);
            } else {
                setSelectedId(null);
            }
        } catch (e) {
            console.error("배송지 목록 조회 실패:", e);
            setAddresses([]);
            setSelectedId(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ===== 폼 입력 처리 =====
    const handleFormChange = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // 새 배송지 추가 모드로 전환
    const handleNewMode = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    // 수정 모드로 전환
    const handleEdit = (addr) => {
        setEditingId(addr.id);
        setForm({
            address_name: addr.address_name || "",
            recipient: addr.recipient || "",
            phone: addr.phone || "",
            postal_code: addr.postal_code || "",
            address: addr.address || "",
            detail_address: addr.detail_address || "",
            is_default: !!addr.is_default,
        });
        setShowForm(true);
    };

    // 배송지 삭제
    const handleDelete = async (id) => {
        if (!window.confirm("해당 배송지를 삭제하시겠습니까?")) return;

        try {
            await axiosClient.delete(`/api/addresses/${id}`);

            // 삭제 후 목록 갱신
            await fetchAddresses();

            // 삭제하던 게 선택 중이거나 수정 중이었다면 초기화
            if (selectedId === id) {
                setSelectedId(null);
            }
            if (editingId === id) {
                setEditingId(null);
                setForm(emptyForm);
            }

            alert("배송지가 삭제되었습니다.");
        } catch (e) {
            console.error("배송지 삭제 실패:", e);
            alert("배송지 삭제 중 오류가 발생했습니다.");
        }
    };

    // 새 배송지 저장 또는 기존 배송지 수정
    const handleSaveForm = async () => {
        if (!form.address_name || !form.recipient || !form.phone) {
            alert("배송지 이름, 수령인, 연락처는 필수입니다.");
            return;
        }

        try {
            setSaving(true);

            if (editingId != null) {
                // 수정
                const dto = mapFormToDto(form, { address_id: editingId });
                await axiosClient.patch(`/api/addresses/${editingId}`, dto);
                alert("배송지가 수정되었습니다.");
            } else {
                // 새로 추가
                const dto = mapFormToDto(form);
                await axiosClient.post("/api/addresses", dto);
                alert("새 배송지가 추가되었습니다.");
            }

            // 저장/수정 후 목록 다시 불러오기
            await fetchAddresses();

            // 폼 초기화
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(false);
        } catch (e) {
            console.error("배송지 저장/수정 실패:", e);
            alert("배송지 저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    // 선택한 배송지 주문서에 적용
    const handleApplySelected = () => {
        const target = addresses.find((a) => a.id === selectedId);
        if (!target) {
            alert("배송지를 선택해 주세요.");
            return;
        }

        // 부모에서 사용하는 형태로 그대로 넘김
        onChangeAddress({
            address_id: target.id,
            address_name: target.address_name,
            recipient: target.recipient,
            phone: target.phone,
            postal_code: target.postal_code,
            address: target.address,
            detail_address: target.detail_address,
            is_default: target.is_default,
        });

        onClose && onClose();
    };

    return (
        <div className="order-address-panel">
            {/* 상단: 배송지 목록 */}
            <div className="order-address-panel-header">
                <h3>배송지 목록</h3>
                <span className="order-address-count">
                    총 {addresses.length}개
                </span>
            </div>

            {loading ? (
                <div className="order-address-loading">
                    배송지 목록을 불러오는 중입니다...
                </div>
            ) : addresses.length === 0 ? (
                <div className="order-address-empty">
                    등록된 배송지가 없습니다. 아래에서 새 배송지를 추가해 주세요.
                </div>
            ) : (
                <div className="order-address-list">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={
                                "order-address-item" +
                                (addr.id === selectedId
                                    ? " order-address-item--active"
                                    : "")
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
                                        <span className="order-addr-label">
                                            {addr.address_name}
                                        </span>
                                        <span className="order-addr-recipient">
                                            {addr.recipient} {addr.phone}
                                        </span>
                                        {addr.is_default && (
                                            <span className="order-addr-badge">
                                                기본 배송지
                                            </span>
                                        )}
                                    </div>
                                    <div className="order-address-line-bottom">
                                        ({addr.postal_code}) {addr.address}{" "}
                                        {addr.detail_address}
                                    </div>
                                </div>
                            </label>

                            <div className="order-address-actions">
                                <button
                                    type="button"
                                    className="order-addr-action-btn order-addr-edit"
                                    onClick={() => handleEdit(addr)}
                                >
                                    수정
                                </button>
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
            )}

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
                    disabled={!selectedId}
                >
                    선택한 배송지 적용
                </button>
            </div>

            {/* 새 배송지 추가 버튼 */}
            <div className="order-address-add-toggle-wrap">
                <button
                    type="button"
                    className="order-address-btn order-address-btn-ghost"
                    onClick={handleNewMode}
                >
                    새 배송지 추가
                </button>
            </div>

            {/* 새 배송지 추가 / 수정 폼 */}
            {showForm && (
                <div className="order-address-add">
                <div className="order-address-add-header">
                    <h4>{editingId ? "배송지 수정" : "새 배송지 추가"}</h4>
                </div>

                <div className="order-address-form-grid">
                    <input
                        className="order-address-input"
                        placeholder="배송지 이름 (집 / 회사 등)"
                        value={form.address_name}
                        onChange={(e) =>
                            handleFormChange("address_name", e.target.value)
                        }
                    />
                    <input
                        className="order-address-input"
                        placeholder="수령인 이름"
                        value={form.recipient}
                        onChange={(e) =>
                            handleFormChange("recipient", e.target.value)
                        }
                    />
                    <input
                        className="order-address-input"
                        placeholder="연락처"
                        value={form.phone}
                        onChange={(e) =>
                            handleFormChange("phone", e.target.value)
                        }
                    />
                    <input
                        className="order-address-input"
                        placeholder="우편번호"
                        value={form.postal_code}
                        onChange={(e) =>
                            handleFormChange("postal_code", e.target.value)
                        }
                    />
                    <input
                        className="order-address-input order-address-input-full"
                        placeholder="도로명 주소"
                        value={form.address}
                        onChange={(e) =>
                            handleFormChange("address", e.target.value)
                        }
                    />
                    <input
                        className="order-address-input order-address-input-full"
                        placeholder="상세 주소 (동/호수 등)"
                        value={form.detail_address}
                        onChange={(e) =>
                            handleFormChange("detail_address", e.target.value)
                        }
                    />
                </div>

                <label className="order-address-default-check">
                    <input
                        type="checkbox"
                        checked={form.is_default}
                        onChange={(e) =>
                            handleFormChange("is_default", e.target.checked)
                        }
                    />
                    이 주소를 기본 배송지로 사용
                </label>

                <div className="order-address-panel-actions">
                    <button
                        type="button"
                        className="order-address-btn order-address-btn-ghost"
                        onClick={() => {
                            setEditingId(null);
                            setForm(emptyForm);
                            setShowForm(false);
                        }}
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="order-address-btn"
                        onClick={handleSaveForm}
                        disabled={saving}
                    >
                        {saving
                            ? "저장 중..."
                            : editingId
                                ? "수정 완료"
                                : "저장하기"}
                    </button>
                </div>
            </div>
            )}
        </div>
    );
}