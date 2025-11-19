package com.review.shop.Util;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "file.upload")
public class FileUploadProperties {

    private String userDir;
    private String adminDir;

    public String getUserDir() { return userDir; }
    public void setUserDir(String userDir) { this.userDir = userDir; }

    public String getAdminDir() { return adminDir; }
    public void setAdminDir(String adminDir) { this.adminDir = adminDir; }
}