import styled from "styled-components";

export const Wrap = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

export const Inner = styled.div`
    width: 100%;
    max-width: 1200px;
    padding: 30px 20px;
`;

export const Content = styled.div`
    background: #fff;
    padding: 40px 50px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

export const TitleRow = styled.div`
    margin-bottom: 25px;
`;

export const Title = styled.h2`
    font-size: 26px;
    font-weight: 700;
    margin: 0;
`;

export const FilterRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
`;

export const LeftFilterGroup = styled.div`
    display: flex;
    gap: 10px;
`;

export const RightSearchGroup = styled.div`
    display: flex;
    gap: 10px;
`;

export const SearchInput = styled.input`
    padding: 9px 14px;
    border-radius: 6px;
    border: 1px solid #ddd;
    width: 230px;
`;

export const FilterSelect = styled.select`
    padding: 9px 14px;
    border-radius: 6px;
    border: 1px solid #ddd;
`;

export const TableWrapper = styled.div`
    margin-top: 20px;
`;

export const OrderTable = styled.table`
    width: 100%;
    border-collapse: collapse;

    th, td {
        padding: 14px 10px;
        border-bottom: 1px solid #eee;
        text-align: left;
        font-size: 14px;
    }

    th {
        background: #fafafa;
        font-weight: 600;
    }
`;

export const StatusBadge = styled.span`
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    color: #fff;

    ${({ status }) => status === "completed" && `background:#6c63ff;`}
    ${({ status }) => status === "in_delivery" && `background:#f5a623;`}
    ${({ status }) => status === "delivered" && `background:#4caf50;`}
`;

export const ActionButton = styled.button`
    background: #111;
    color: #fff;
    padding: 7px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 13px;
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
