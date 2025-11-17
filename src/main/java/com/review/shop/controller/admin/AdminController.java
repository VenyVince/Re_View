package com.review.shop.controller.admin;

import com.review.shop.dto.ProductDetailDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.service.admin.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    AdminService adminService;
    
    // role에 대한 검증은 추후에 처리

    //상품 등록 (테스트 완료)
    @PostMapping("/products")
    public ResponseEntity<String> insertProduct(@RequestBody ProductDetailDTO product) {
        adminService.insertProduct(product);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("상품이 등록되었습니다");
    }

    // 상품 수정 (테스트 완료)
    // 현재 구조로는 수정사항을 포함하여 모든 json 데이터를 받아야함, 추후에 부분수정 기능 구현 가능
    @PatchMapping("/products/{productId}")
    public ResponseEntity<String> updateProduct(
            @PathVariable int productId,
            @RequestBody ProductDetailDTO product) {
        adminService.updateProduct(productId, product);
        return ResponseEntity.ok("상품이 수정되었습니다");
    }

    // 상품 삭제 (테스트 완료)
    // 실제로 DB에서 삭제는 방식이 아닌, DELETED_DATE 컬럼에 날짜를 기록하는 방식으로 구현
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable int productId) {
        adminService.deleteProduct(productId);
        return ResponseEntity.ok("상품이 삭제되었습니다");
    }

    // 상품 주문 현황 변경 (테스트 완료)
    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable int orderId,
            @RequestBody Map<String, String> payload) {
        String orderStatus = payload.get("orderStatus");
        adminService.updateOrderStatus(orderId, orderStatus);
        return ResponseEntity.ok("주문 상태가 변경되었습니다");
    }

    // QnA 답변 등록/수정 (테스트 완료)
    @PatchMapping("/qna/{qnaId}/answer")
    public ResponseEntity<String> updateQnaAnswer(
            @PathVariable int qnaId,
            @RequestBody Map<String, String> payload) {
        String adminAnswer = payload.get("adminAnswer");

        adminService.updateQnaAnswer(qnaId, adminAnswer);
        return ResponseEntity.ok("QnA 답변이 등록되었습니다");
    }

    // 회원 포인트 조회 (테스트 완료)
    @GetMapping("/users/{userId}/points")
    public ResponseEntity<Map<String, Integer>> getMemberPoints(@PathVariable int userId) {
        int points = adminService.getMemberPoints(userId);
        return ResponseEntity.ok(Map.of("points", points));
    }

    //어드민 페이지에서 모든 상품 불러오기(테스트 완료)
    @GetMapping("/allproducts")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(adminService.getAllProducts());
    }

    //어드민 관련 예외 처리 핸들러 400으로 통일
    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<String> handleWrongRequest(DatabaseException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }
}