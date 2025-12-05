package com.review.shop.image.minio;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MinioTestController {

    private final MinioTestService minioTestService;

    @GetMapping("/minio/test")
    public String test() throws Exception {
        minioTestService.testConnection();
        return "MinIO connection test completed.";
    }
}