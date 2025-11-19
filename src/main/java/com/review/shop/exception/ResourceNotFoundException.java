package com.review.shop.exception;

// 조회결과 없을 때(조회결과 데이터 0개)
public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message){
        super(message);
    }
}
