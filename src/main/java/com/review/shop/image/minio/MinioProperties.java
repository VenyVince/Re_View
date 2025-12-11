package com.review.shop.image.minio;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "minio")
public class MinioProperties {
    private String url;
    private String rootUser;
    private String rootPassword;
    private String bucket;
}