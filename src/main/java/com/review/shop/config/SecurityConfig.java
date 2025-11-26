package com.review.shop.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@AllArgsConstructor
public class SecurityConfig {

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        //어드민만 가능
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

//                        //모두 가능, 프론트 테스트 때문에 임시로 admin 제외 모두 허용
//                        .requestMatchers(
//                                "/api/auth/register",
//                                "/api/auth/login",
//                                "/api/auth/send-temp-password",
//                                "/api/auth/check-id",
//                                "/api/search/**",
//                                "/api/products",
//                                "/api/auth/logout",
//                                "/api/auth/me"
//
//                        ).permitAll()

//                        //유저만 가능
//                        .anyRequest().hasRole("USER")
//
                            .anyRequest().permitAll()
                )


                // 접근이 거부되었을 때와 인증이 필요한 경우의 핸들러 설정
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(400);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("접근 권한이 부족합니다.");
                        })
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(400);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("로그인이 필요합니다.");
                        })
                ) //

                .logout(logout -> logout

                        .logoutUrl("/api/auth/logout")

                        .deleteCookies("JSESSIONID")

                        .logoutSuccessHandler((request, response, authentication) -> {

                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().write("로그아웃 되었습니다.");

                        })
                );

        return http.build();
    }
}