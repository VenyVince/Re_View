// src/api/qna/qnaApi.js
import axiosClient from "../axiosClient";

export const fetchQnaList = (productId) =>
    axiosClient.get(`/api/qna/list/${productId}`);
