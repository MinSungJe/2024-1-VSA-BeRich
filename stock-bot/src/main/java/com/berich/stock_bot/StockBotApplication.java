package com.berich.stock_bot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
//@EnableAspectJAutoProxy(proxyTargetClass = true)
@EnableAsync
public class StockBotApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockBotApplication.class, args);
	}

}
