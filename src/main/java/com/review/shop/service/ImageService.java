package com.review.shop.service;

import com.review.shop.util.FileUploadProperties;
import com.review.shop.util.Security_Util;
import com.review.shop.exception.FileProcessingException;
import com.review.shop.exception.WrongRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final FileUploadProperties fileUploadProperties;
    private final Security_Util security_util;

    private static final int MAX_REVIEW_IMAGES = 5;

    // isProduct는 디렉토리를 위해서 넣은 부분 입니다.

    public List<String> uploadReviewImages(MultipartFile[] images) {
        String role = security_util.getCurrentUserRole();
        if ("ADMIN".equalsIgnoreCase(role)) {
            throw new WrongRequestException("관리자는 리뷰를 작성할 수 없습니다.");
        }

        if (images.length > MAX_REVIEW_IMAGES) {
            throw new WrongRequestException("이미지는 최대 "+MAX_REVIEW_IMAGES+"개까지만 업로드 가능합니다");
        }

        // 리뷰 이미지는 userDir/reviews/

        String uploadDir = fileUploadProperties.getUserDir() + "/";

        return saveImages(images, uploadDir, false);
    }

    public List<String> uploadProductImages(MultipartFile[] images) {
        String role = security_util.getCurrentUserRole();
        if ("USER".equalsIgnoreCase(role)) {
            throw new WrongRequestException("사용자는 접근할 수 없습니다.");
        }

        // 상품 이미지는 adminDir/products/
        String uploadDir = fileUploadProperties.getAdminDir() + "/";

        return saveImages(images, uploadDir, true);
    }


    private List<String> saveImages(MultipartFile[] images, String uploadDir, boolean isProduct) {
        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile image : images) {
            imageUrls.add(saveSingleImage(image, uploadDir, isProduct));
        }

        return imageUrls;
    }


    private String saveSingleImage(MultipartFile image, String baseDir, boolean isProduct) {

        // products 또는 reviews
        String folder = isProduct ? "products" : "reviews";

        // 실제 저장할 서버 절대 경로
        String uploadDir = baseDir + folder + "/";

        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String originalName = image.getOriginalFilename();
            if (originalName == null || originalName.isEmpty()) {
                throw new WrongRequestException("파일 이름이 없습니다");
            }

            String ext = getFileExtension(originalName);
            String savedFileName = UUID.randomUUID().toString() + ext;
            File savedFile = new File(dir, savedFileName);

            image.transferTo(savedFile);

            // 웹 URL 반환 (user_id 제거)
            return "/uploads/" + folder + "/" + savedFileName;

        } catch (IOException e) {
            throw new FileProcessingException("이미지 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }


    private String getFileExtension(String fileName) {
        int idx = fileName.lastIndexOf(".");
        if (idx > 0 && idx < fileName.length() - 1) {
            return fileName.substring(idx);
        }
        return ".jpg";
    }
}
