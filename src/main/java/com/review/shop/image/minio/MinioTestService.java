package com.review.shop.image.minio;

import io.minio.BucketExistsArgs;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MinioTestService {

    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    public void testConnection() throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket(minioProperties.getBucket())
                        .build()
        );

        System.out.println("Bucket exists? " + exists);
    }
}
