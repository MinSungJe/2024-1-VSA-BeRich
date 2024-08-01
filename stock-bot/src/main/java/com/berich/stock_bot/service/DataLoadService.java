package com.berich.stock_bot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

@Service
@Order(2)
public class DataLoadService implements CommandLineRunner {

    @Autowired
    private CompanyInformationService companyInformationService;

    @Autowired
    private StockInformationService stockInformationService;



    @Override
    public void run(String... args) throws Exception {
        // 주식 코드 목록 조회
        List<String> stockCodes = companyInformationService.getAllStockCodes();

        // 주식 시세 데이터 요청 및 저장
        stockInformationService.fetchAndSaveStockData(stockCodes, "5d", "1h");
    }
}
