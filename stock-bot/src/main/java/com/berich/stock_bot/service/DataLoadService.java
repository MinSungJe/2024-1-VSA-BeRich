package com.berich.stock_bot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import com.berich.stock_bot.repository.CompanyNewsRepository;
import com.berich.stock_bot.repository.StockInformationDRepository;
import com.berich.stock_bot.repository.StockInformationHRepository;

@Service
@Order(2)
public class DataLoadService implements CommandLineRunner {

    @Autowired
    private CompanyInformationService companyInformationService;

    @Autowired
    private StockInformationService stockInformationService;

    @Autowired
    private CompanyNewsService companyNewsService;
    
    @Autowired
    private StockInformationHRepository stockInformationHRepository;

    @Autowired
    private StockInformationDRepository stockInformationDRepository;

    @Autowired
    private CompanyNewsRepository companyNewsRepository;

    private List<String> stockCodes;

    @Override
    public void run(String... args) throws Exception {

        // 애플리케이션 시작 시 데이터베이스 초기화
        if (stockInformationHRepository.count() > 0) {//오일 데이터
            stockInformationHRepository.deleteAll();
        }
        if (stockInformationDRepository.count() > 0) {//한달 데이터
            stockInformationDRepository.deleteAll();
        }
        // 주식 코드 목록 조회
        stockCodes = companyInformationService.getAllStockCodes();
        // 주식 시세 데이터 요청 및 저장
        stockInformationService.fetchAndSaveStockData(stockCodes, "5d", "1h");//오일-한시간 간격
        stockInformationService.fetchAndSaveStockData(stockCodes, "3mo","1d");//세달-하루 간격
        
        if (companyNewsRepository.count()<=0){//아무 뉴스도 없을때만 불러오기, 테스트용
            companyNewsService.getNewsScheduled();
        }
        
    }

}
