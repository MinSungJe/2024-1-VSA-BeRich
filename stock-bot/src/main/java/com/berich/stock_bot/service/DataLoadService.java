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

    // //한시간마다(20분기준) 주식시세 업데이트(주말제외,9~2시까지)
    // @Scheduled(cron = "0 20 9-14 ? * MON-FRI") //
    // //@Async
    // public void updateInformationH() {
    //     // 주식 코드 목록 조회
    //     if(stockCodes.isEmpty())
    //         stockCodes = companyInformationService.getAllStockCodes();
    //     // 주식 시세 데이터 요청 및 저장
    //     stockInformationService.fetchAndSaveStockData(stockCodes, "1d", "1h");

    // }

    // //하루마다 주식시세 업데이트(주말제외)
    // @Scheduled(cron = "0 0 0 ? * MON-FRI") //
    // //@Async
    // public void updateInformationD() {
    //     // 주식 코드 목록 조회
    //     if(stockCodes.isEmpty())
    //         stockCodes = companyInformationService.getAllStockCodes();
    //     // 주식 시세 데이터 요청 및 저장
    //     stockInformationService.fetchAndSaveStockData(stockCodes, "1d", "1d");

    // }

    // //자정마다 오래된 주식시세 삭제(주말제외)
    // @Scheduled(cron = "0 0 0 ? * MON-THU") // 주말제외 자정 실행
    // @Async
    // public void deleteBeforeData() {
    //     //가장 작은 timestamp 날짜 +1보다 작은 값 모두 삭제
    //     Long oldestTime = stockInformationHRepository.findMinTimestamp();
    //     Long threshold = oldestTime + 86400000;

    //     stockInformationHRepository.deleteByTimestampBefore(threshold);

    //     //가장 오래된 날짜(3개월 기준)
    //     Long oldestDay = stockInformationDRepository.findMinTimestamp();
    //     stockInformationDRepository.deleteByTimestamp(oldestDay);

    // }
}
