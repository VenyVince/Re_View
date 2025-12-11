package com.review.shop.exception;

// 잘못된 요청( required 파라미터 누락, 잘못된 값, 키워드 길이 초과 등)
public class WrongRequestException extends RuntimeException {
    public WrongRequestException(String message) {
        super(message);
    }
}