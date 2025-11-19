package com.review.shop.config;

import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

// 프로젝트 전체 예외 처리 클래스
@RestController
public class ExceptionHandlers {
 
    //exception 패키지 참조

    // 데이터 없음
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFount(ResourceNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    // 잘못된 요청
    @ExceptionHandler(WrongRequestException.class)
    public ResponseEntity<String> handleWrongRequest(WrongRequestException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
    }

    // DB 관련(Mapper.xml 오류 등)
    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<String> handleDatabase(DatabaseException exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
    }

    // 로그인 실패
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleLoginException(BadCredentialsException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exception.getMessage());
    }
}
