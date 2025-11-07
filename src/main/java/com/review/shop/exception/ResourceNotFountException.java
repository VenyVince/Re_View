package com.review.shop.exception;

// 조회결과 없을 때(조회결과 데이터 0개)
public class ResourceNotFountException extends RuntimeException{
    public ResourceNotFountException(String message){
        super(message);
    }
}
