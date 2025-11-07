package com.review.shop.config;

import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFountException;
import com.review.shop.exception.WrongRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

// 프로젝트 전체 예외 처리 클래스
@ControllerAdvice
public class ExceptionHandlers {
 
    //exception 패키지 참조
    @ExceptionHandler(ResourceNotFountException.class)
    public ResponseEntity<String> handleNotFount(ResourceNotFountException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }
    
    @ExceptionHandler(WrongRequestException.class)
    public ResponseEntity<String> handleWrongRequest(WrongRequestException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
    }
    
    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<String> handleDatabase(DatabaseException exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
    }

    // 로그인의 예외처리(내장 예외 클래스)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleLoginException(BadCredentialsException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exception.getMessage());
    }
}
