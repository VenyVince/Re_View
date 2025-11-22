package com.review.shop.controller;

import com.review.shop.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;



@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Tag(name = "Image Upload", description = "이미지 업로드 API")
public class ImageUploadController {
    //review이미지 및 product이미지 처리
    // C:\review\하위 폴더에 저장
    private final ImageService imageService;

    @Operation(summary = "리뷰 이미지 업로드", description = "리뷰 이미지를 최대 5개까지 업로드합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "이미지 업로드 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "파일 처리 오류 (FileProcessingException)")
    })
    @PostMapping("/reviews")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("images") MultipartFile[] images) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(imageService.uploadReviewImages(images));
    }

    @Operation(summary = "상품 이미지 업로드", description = "상품 이미지를 업로드합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "이미지 업로드 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "파일 처리 오류 (FileProcessingException)")
    })
    @PostMapping("/products")
    public ResponseEntity<List<String>> uploadProductsImages(@RequestParam("images") MultipartFile[] images) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(imageService.uploadProductImages(images));
    }

//    @PostMapping("/reviews")
//
//    public ResponseEntity<List<String>> uploadImages(@RequestParam("images") MultipartFile[] images) {
//
//        String uploadDir = "";
//        if (images.length > 5) {
//            throw new WrongRequestException("이미지는 최대 5개까지만 업로드 가능합니다");
//        }
//
//        // 현재 로그인한 사용자 role 조회
//        String role = security_util.getCurrentUserRole(); // "USER" or "ADMIN"
//
//        if(role.equalsIgnoreCase("ADMIN")){
//            throw new WrongRequestException("관리자는 리뷰를 작성할 수 없습니다.");
//        } else{
//            uploadDir = fileUploadProperties.getUserDir() + "/";
//        }
//
//
//        List<String> imageUrls = new ArrayList<>();
//        for (MultipartFile image : images) {
//            imageUrls.add(saveImage(image, uploadDir, role));
//        }
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(imageUrls);
//    }
//
//    @PostMapping("/products")
//
//    public ResponseEntity<List<String>> uploadProductsImages(@RequestParam("images") MultipartFile[] images) {
//
//        String uploadDir = "";
//
//        // 현재 로그인한 사용자 role 조회
//        String role = security_util.getCurrentUserRole(); // "USER" or "ADMIN"
//
//        if(role.equalsIgnoreCase("USER")){
//            throw new WrongRequestException("사용자는 접근할 수 없습니다.");
//        } else {
//            uploadDir = fileUploadProperties.getAdminDir() + "/";
//        }
//
//
//        List<String> imageUrls = new ArrayList<>();
//        for (MultipartFile image : images) {
//            imageUrls.add(saveImage(image, uploadDir, role));
//        }
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(imageUrls);
//    }
//
//    private String saveImage(MultipartFile image, String uploadDir, String role) {
//
//        int user_id = security_util.getCurrentUserId();
//        uploadDir = uploadDir + user_id + "/";
//
//        try {
//            File dir = new File(uploadDir);
//            if (!dir.exists()) dir.mkdirs(); // 폴더 없으면 생성
//
//            String originalFileName = image.getOriginalFilename();
//            if (originalFileName == null || originalFileName.isEmpty()) {
//                throw new WrongRequestException("파일 이름이 없습니다");
//            }
//
//            // 확장자 추출
//            String ext = ".jpg";
//            int dotIdx = originalFileName.lastIndexOf(".");
//            if (dotIdx > 0 && dotIdx < originalFileName.length() - 1) {
//                ext = originalFileName.substring(dotIdx);
//            }
//
//            String savedFileName = UUID.randomUUID().toString() + ext;
//            File savedFile = new File(dir, savedFileName);
//            image.transferTo(savedFile);
//
//            // 웹서버에서 읽을 URL(실제 저장 경로 X, 실제 저장 경로는 uploadDir)
//            if(role.equalsIgnoreCase("ADMIN")){
//                return "/uploads/products/" + user_id + "/" + savedFileName;
//            }
//            else {
//                return "/uploads/reviews/" + user_id + "/" + savedFileName;
//            }
//        } catch (IOException e) {
//            throw new FileProcessingException("이미지 저장 중 오류가 발생했습니다: " + e.getMessage());
//        }
//    }
}
