package com.review.shop.util;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "file.upload")
public class FileUploadProperties {

    private String userDir;
    private String adminDir;

}