package com.review.shop.config;

import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.FileProcessingException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// 프로젝트 전체 예외 처리 클래스
@RestControllerAdvice
public class ExceptionHandlers {
 
    //exception 패키지 참조

    // 이외 오류
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalException(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(exception.getMessage());
    }

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

    // 파일 처리 실패
    @ExceptionHandler(FileProcessingException.class)
    public ResponseEntity<String> handleIOException(FileProcessingException exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("파일 처리 중 오류가 발생했습니다: " + exception.getMessage());
    }

}
