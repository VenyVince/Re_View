package com.review.shop.config;

import com.review.shop.Util.FileUploadProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class UploadConfig implements WebMvcConfigurer {

    private final FileUploadProperties fileUploadProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 리뷰 user 이미지
        registry.addResourceHandler("/uploads/reviews/**")
                .addResourceLocations("file:///" + fileUploadProperties.getUserDir().replace("\\", "/"))
                .setCachePeriod(3600);

        // admin 이미지
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations("file:///" + fileUploadProperties.getAdminDir().replace("\\", "/"))
                .setCachePeriod(3600);
    }
}
