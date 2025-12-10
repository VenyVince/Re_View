import styled from "styled-components";

export const Wrap = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    background: #fafafa;
    min-height: calc(100vh - 120px);
`;

export const Inner = styled.div`
    width: 100%;
    max-width: 1200px;
    padding: 24px 16px 48px;
`;

export const Content = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 24px 24px 32px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
`;

export const TitleRow = styled.div`
    margin-bottom: 20px;
`;

export const Title = styled.h2`
    font-size: 24px;
    font-weight: 800;
    text-align: left;
`;

export const FilterRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
`;

export const FilterLabel = styled.span`
    font-size: 14px;
    color: #555;
    line-height: 1;
    display: flex;
    align-items: center; 
`;


export const LeftFilterGroup = styled.div`
    display: flex;
    gap: 10px;
`;

export const RightSearchGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-left: auto;
`;

export const SearchInput = styled.input`
    margin-left: auto;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    min-width: 220px;
    font-size: 14px;
`;

export const FilterSelect = styled.select`
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
    background: white;
`;

export const TableWrapper = styled.div`
    border-radius: 12px;
    border: 1px solid #eee;
    overflow: hidden;
    background: #fff;
`;

export const OrderTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;

    thead {
        background: #f8f9fb;
    }

    th, td {
        padding: 10px 12px;
        border-bottom: 1px solid #eee;
        text-align: left;
    }

    th {
        font-weight: 600;
        color: #333;
    }

    tbody tr:hover {
        background: #fafafa;
    }
`;

export const StatusBadge = styled.span`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;

    ${({ status }) =>
            status === "completed" &&
            `
      background: #e8e7ff;
      color: #5b4bff;
    `}

    ${({ status }) =>
            status === "in_delivery" &&
            `
      background: #fff4e5;
      color: #f08c00;
    `}

    ${({ status }) =>
            status === "delivered" &&
            `
      background: #e3f7e5;
      color: #2c9a41;
    `}
`;

export const ActionButton = styled.button`
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    font-size: 13px;

    &:hover {
        background: #f1f3f5;
    }
`;

export const PaginationBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 12px;

    button {
        padding: 6px 12px;
        border: 1px solid #ddd;
        background: #fff;
        border-radius: 6px;
        cursor: pointer;

        &:disabled {
            opacity: 0.4;
            cursor: default;
        }
    }

    span {
        display: flex;
        align-items: center; 
        font-size: 14px;
        line-height: 1; 
    }
`;

