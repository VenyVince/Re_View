package com.review.shop.controller.product;

import com.review.shop.Util.Security_Util;
import com.review.shop.exception.FileProcessingException;
import com.review.shop.exception.WrongRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageUploadController {

    private final Security_Util security_Util;

    private static final String USER_UPLOAD_DIR = "/uploads/reviews/user/";
    private static final String ADMIN_UPLOAD_DIR = "/uploads/reviews/admin/";

    @PostMapping("/reviews")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("images") MultipartFile[] images) {

        if (images.length > 5) {
            throw new WrongRequestException("이미지는 최대 5개까지만 업로드 가능합니다");
        }

        // 현재 로그인한 사용자 role 조회
        String role = security_Util.getCurrentUserRole(); // "user" or "admin"
        String uploadDir = role.equals("admin") ? ADMIN_UPLOAD_DIR : USER_UPLOAD_DIR;

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            imageUrls.add(saveImage(image, uploadDir));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(imageUrls);
    }

    private String saveImage(MultipartFile image, String uploadDir) {

        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String originalFileName = image.getOriginalFilename();
            if (originalFileName == null || originalFileName.isEmpty()) {
                throw new WrongRequestException("파일 이름이 없습니다");
            }

            String ext = ".jpg";
            int dotIdx = originalFileName.lastIndexOf(".");
            if (dotIdx > 0 && dotIdx < originalFileName.length() - 1) {
                ext = originalFileName.substring(dotIdx);
            }

            String savedFileName = UUID.randomUUID().toString() + ext;
            File savedFile = new File(uploadDir + savedFileName);
            image.transferTo(savedFile);

            return uploadDir + savedFileName;

        } catch (IOException e) {
            throw new FileProcessingException("이미지 저장 중 오류가 발생했습니다" + e);
        }
    }
}