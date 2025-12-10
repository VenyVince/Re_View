package com.review.shop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 프론트 서버 주소 허용 (CRA)
        config.setAllowedOrigins(
                List.of("http://221.143.110.221:3000")
        );

        // 허용할 HTTP 메서드
        config.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );

        // 모든 헤더 허용
        config.setAllowedHeaders(List.of("*"));

        // 쿠키/Authorization 헤더 허용
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 우리 API 전체에 CORS 적용
        source.registerCorsConfiguration("/api/**", config);

        return source;
    }
}