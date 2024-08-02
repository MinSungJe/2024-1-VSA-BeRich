package com.berich.stock_bot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.berich.stock_bot.repository.StockInformationHRepository;

@Service
@Order(2)
public class DataLoadService implements CommandLineRunner {

    @Autowired
    private CompanyInformationService companyInformationService;

    @Autowired
    private StockInformationService stockInformationService;

    @Autowired
    private StockInformationHRepository stockInformationHRepository;

    private List<String> stockCodes;

    @Override
    public void run(String... args) throws Exception {

        // 주식 코드 목록 조회
        stockCodes = companyInformationService.getAllStockCodes();
        // 주식 시세 데이터 요청 및 저장
        stockInformationService.fetchAndSaveStockData(stockCodes, "5d", "1h");//오일-한시간 간격
        //stockInformationService.fetchAndSaveStockData(stockCodes, "3mo","1d");//세달-하루 간격
    }

    //한시간마다 주식시세 업데이트(주말제외,9~2시까지)
    @Scheduled(cron = "0 0 9-14 ? * MON-FRI") //
    public void updateInformation() {
        // 주식 코드 목록 조회
        if(stockCodes.isEmpty())
            stockCodes = companyInformationService.getAllStockCodes();
        // 주식 시세 데이터 요청 및 저장
        stockInformationService.fetchAndSaveStockData(stockCodes, "1d", "1h");

    }

    //자정마다 오래된 주식시세 삭제(주말제외)
    @Scheduled(cron = "0 0 0 ? * MON-THU") // 주말제외 자정 실행
    @Transactional
    public void deleteBeforeData() {
        //가장 작은 timestamp 날짜 +1보다 작은 값 모두 삭제
        Long oldestTime = stockInformationHRepository.findMinTimestamp();
        Long threshold = oldestTime + 86400000;

        stockInformationHRepository.deleteByTimestampBefore(threshold);


    }
}
