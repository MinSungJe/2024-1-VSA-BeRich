package com.berich.stock_bot.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.berich.stock_bot.entity.CompanyInformation;
import com.berich.stock_bot.entity.StockInformationH;
import com.berich.stock_bot.repository.CompanyInformationRepository;
import com.berich.stock_bot.repository.StockInformationHRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;

@Service
public class StockInformationService {

    @Autowired
    private CompanyInformationRepository companyInformationRepository;

    @Autowired
    private WebClient webClient_py;

    @Autowired
    private StockInformationHRepository stockInformationHRepository;

    // @PostConstruct
    // public void init() {
    //     // webClient_py 초기화 확인 로그
    //    // System.out.println("초기화 된거라곡고고고: " + webClient_py.toString());
    // }
    //해당주식의 1M 데이터 데베에서 가져오기
    public List<StockInformationH> getStock1MInfo(String stockCode) {
        
        CompanyInformation company = companyInformationRepository.findByStockCode(stockCode).orElse(null);
        
        if (company !=null){
            //해당 회사 있으면
            return company.getStockInformationH();

        } else {
            //해당회사 없음
            return List.of();//빈리스트 반환
        }
        
    }

    // 모든 주식에 대해 시세 받아오고 저장
    public void fetchAndSaveStockData(List<String> stockCodes, String period, String interval) {
        if (period.equals("5d")){
                stockInformationHRepository.deleteAll(); //30일데이터를 한번에 불러오는 경우 리셋
        }
        for (String stockCode : stockCodes) {
            // 주식 코드로 회사 정보 조회
            CompanyInformation company = companyInformationRepository.findByStockCode(stockCode).orElse(null);
            if(company != null) {
                Mono<String> dataMono = getFinanceData(stockCode, period, interval);
                String data = dataMono.block();
        
                //System.out.println("출력겨겨겨겨겨"+data);
                
                if(interval.equals("1h")) {
                    List<StockInformationH> stockData = parseStockData(data, company);//entity로 변환
                    stockInformationHRepository.saveAll(stockData);
                } else if (interval.equals("1d")){
                    //List<StockInformationD> stockData = parseStockData(data);//entity로 변환
                    //stockInformationDRepository.saveAll(stockData);
                }
            }
            
        }
    }

    //주식데이터 가져오기
    private Mono<String> getFinanceData(String stockCode, String period, String interval) {
        // Flask API에 GET 요청을 보내고 응답을 Mono<String>으로 반환
        String tickerSymbol = stockCode+".KS";//주식코드+.KS
        //System.out.println("주식코드느느느느느느"+tickerSymbol);
        return webClient_py.get()
            .uri(uriBuilder -> uriBuilder
                .path("/api/finance")
                .queryParam("ticker", tickerSymbol)
                .queryParam("period", period)
                .queryParam("interval", interval)
                .build())
            .retrieve()
            .bodyToMono(String.class)
            .onErrorResume(e -> Mono.error(new RuntimeException("Failed to fetch finance data", e)));
    }


    //entity로 변환
    private List<StockInformationH> parseStockData(String data, CompanyInformation company) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            List<Map<String, Object>> list = mapper.readValue(data, new TypeReference<List<Map<String, Object>>>() {});
            List<StockInformationH> stockInfoList = new ArrayList<>();
            for (Map<String, Object> map : list) {
                StockInformationH stockInfo = new StockInformationH();
                stockInfo.setTimestamp(((Number) map.get("timestamp")).longValue());
                stockInfo.setOpen((Double) map.get("Open"));
                stockInfo.setHigh((Double) map.get("High"));
                stockInfo.setLow((Double) map.get("Low"));
                stockInfo.setClose((Double) map.get("Close"));
                stockInfo.setVolume(((Number) map.get("Volume")).longValue());
                stockInfo.setCompanyInformation(company);
                stockInfoList.add(stockInfo);
            }
            return stockInfoList;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse stock data", e);
        }
    }

}
