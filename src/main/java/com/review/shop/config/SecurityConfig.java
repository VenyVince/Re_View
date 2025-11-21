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
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/send-temp-password",
                                "/api/auth/check-id",
                                "/api/search/**",
                                "/api/products",
                                "/api/auth/logout"
                        ).permitAll()
                        .anyRequest().hasRole("USER")
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