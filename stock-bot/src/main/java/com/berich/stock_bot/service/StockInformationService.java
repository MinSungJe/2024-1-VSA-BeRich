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
                stockInformationHRepository.deleteAll(); //30일데이터를 한번에 불러오는 경우 데이터베이스 리셋
        }
        // 모든 주식에 대해
        for (String stockCode : stockCodes) {
            // 주식 코드로 회사 정보 조회
            CompanyInformation company = companyInformationRepository.findByStockCode(stockCode).orElse(null);
            if(company != null) {
                Mono<String> dataMono = getFinanceData(stockCode, period, interval);
                String data = dataMono.block();
                
                if(interval.equals("1h")) {//간격이 한시간
                    
                    List<StockInformationH> stockData = parseStockData(data, company);//entity로 변환
                    if(period.equals("1d")) {
                        StockInformationH newStock = stockData.get(stockData.size() - 1);//하루 데이터중 마지막 인덱스만 저장
                        if(!stockInformationHRepository.existsByTimestamp(newStock.getTimestamp()))//시간이 다른것확인
                            stockInformationHRepository.save(newStock);//저장
                        
                    }else {//5d일때=>처음 서버 실행시에만
                        stockInformationHRepository.saveAll(stockData);
                    }
                    
                } else if (interval.equals("1d")){
                    //List<StockInformationD> stockData = parseStockData(data);//entity로 변환
                    //stockInformationDRepository.saveAll(stockData)인인
                }
            }
            
        }
    }


    //파이썬에서 주식데이터 가져오기
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
