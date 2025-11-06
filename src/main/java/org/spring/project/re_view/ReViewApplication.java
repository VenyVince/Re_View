package org.spring.project.re_view;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.review.shop")
@MapperScan("com.review.shop.repository")
public class ReViewApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReViewApplication.class, args);
    }

}
