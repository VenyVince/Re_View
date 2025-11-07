package com.review.shop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
// Security Config test용으로 임시로 permit ALl 걸어놓음. 테스트용으로만 확인하고 나중에 배포할 때랑 로그인 구현되고 나서는 삭제.
// 비밀번호랑 아이디는  properties에서 확인.
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                //현재 restful api 방식이므로 formLogin, httpBasic 비활성화(기존은 html form 로그인 방식)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // 주의 !!!! CSRF 비활성화 되어있음
                .csrf(AbstractHttpConfigurer::disable) // CSRF 비활성화 (개발 기간동안)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                        .anyRequest().authenticated()
                )

                // 로그아웃 설정
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);

                        })

        );


        return http.build();
    }


}
