package com.review.shop.exception;

// 데이터베이스 관련 문제 발생시
public class DatabaseException extends RuntimeException {
    public DatabaseException(String message, Throwable cause) {

        super(message, cause);
    }
}
