package com.berich.stock_bot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    //한국투자증권
    @Bean
    public WebClient webClient_stock() {
        return WebClient.builder()
            .baseUrl("https://openapivts.koreainvestment.com:29443") //모의계좌 url
            //.defaultHeader("Authorization", "Bearer your-token")
            //.defaultHeader("content-type", "application/json")
            .build();
    }

    //플라스크-파이썬
    @Bean
    public WebClient webClient_py() {
        return WebClient.builder()
            .baseUrl("http://localhost:5000") //모의계좌 url
            //.defaultHeader("Authorization", "Bearer your-token")
            //.defaultHeader("content-type", "application/json")
            .build();
    }
}
