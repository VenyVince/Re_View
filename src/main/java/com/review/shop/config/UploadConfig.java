package com.review.shop.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UploadConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // user 이미지
        registry.addResourceHandler("/uploads/reviews/**")
                .addResourceLocations("file:///C:/review_user/reviews/")
                .setCachePeriod(3600);

        // admin 이미지 (원하면 추가)
        registry.addResourceHandler("/uploads/admin/**")
                .addResourceLocations("file:///C:/review_admin/uploads/")
                .setCachePeriod(3600);
    }
}
