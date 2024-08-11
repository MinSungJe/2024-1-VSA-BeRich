package com.berich.stock_bot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.berich.stock_bot.repository.StockInformationDRepository;
import com.berich.stock_bot.repository.StockInformationHRepository;

@Service
public class UpdateDataService {

    @Autowired
    private CompanyInformationService companyInformationService;

    @Autowired
    private StockInformationService stockInformationService;

    @Autowired
    private StockInformationHRepository stockInformationHRepository;

    @Autowired
    private StockInformationDRepository stockInformationDRepository;

    private List<String> stockCodes;

    //한시간마다(20분기준) 주식시세 업데이트(주말제외,9~2시까지)
    @Scheduled(cron = "0 20 9-15 ? * MON-FRI") //
    //@Async
    public void updateInformationH() {
        // 주식 코드 목록 조회
        if(stockCodes.isEmpty())
            stockCodes = companyInformationService.getAllStockCodes();
        // 주식 시세 데이터 요청 및 저장
        stockInformationService.fetchAndSaveStockData(stockCodes, "1d", "1h");

    }

    //하루마다 주식시세 업데이트(주말제외)
    @Scheduled(cron = "0 0 0 ? * MON-FRI") //
    //@Async
    public void updateInformationD() {
        // 주식 코드 목록 조회
        if(stockCodes.isEmpty())
            stockCodes = companyInformationService.getAllStockCodes();
        // 주식 시세 데이터 요청 및 저장
        stockInformationService.fetchAndSaveStockData(stockCodes, "1d", "1d");

    }

    //자정마다 오래된 주식시세 삭제(주말제외)
    @Scheduled(cron = "0 0 0 ? * MON-THU") // 주말제외 자정 실행
    @Async
    public void deleteBeforeData() {
        //가장 작은 timestamp 날짜 +1보다 작은 값 모두 삭제
        Long oldestTime = stockInformationHRepository.findMinTimestamp();
        Long threshold = oldestTime + 86400000;

        stockInformationHRepository.deleteByTimestampBefore(threshold);

        //가장 오래된 날짜(3개월 기준)
        Long oldestDay = stockInformationDRepository.findMinTimestamp();
        stockInformationDRepository.deleteByTimestamp(oldestDay);

    }
}
