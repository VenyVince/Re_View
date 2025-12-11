package com.review.shop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    private final Environment env;

    public CorsConfig(Environment env) {
        this.env = env;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 환경변수 또는 application.properties에서 읽어와서 할당함. 기본값은 localhost:3000(개발용)
        String origins = env.getProperty("cors.allowed-origins", "http://localhost:3000");

        config.setAllowedOrigins(List.of(origins.split(",")));

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