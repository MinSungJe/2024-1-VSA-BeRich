package com.berich.stock_bot.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.berich.stock_bot.entity.CompanyInformation;
import com.berich.stock_bot.entity.StockInformationD;
import com.berich.stock_bot.entity.StockInformationH;
import com.berich.stock_bot.repository.CompanyInformationRepository;
import com.berich.stock_bot.repository.StockInformationDRepository;
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
    @Autowired
    private StockInformationDRepository stockInformationDRepository;

    //5일 정보 가져오기
    public List<StockInformationH> getStock5DInfo(String stockCode) {
        
        CompanyInformation company = companyInformationRepository.findByStockCode(stockCode).orElse(null);
        
        if (company !=null){
            //해당 회사 있으면
            return company.getStockInformationH();

        } else {
            //해당회사 없음
            return List.of();//빈리스트 반환
        }
        
    }

    //3개월 정보 가져오기
    public List<StockInformationD> getStock3MInfo(String stockCode) {
        
        CompanyInformation company = companyInformationRepository.findByStockCode(stockCode).orElse(null);
        
        if (company !=null){
            //해당 회사 있으면
            return company.getStockInformationD();

        } else {
            //해당회사 없음
            return List.of();//빈리스트 반환
        }
        
    }

    // 모든 주식에 대해 시세 받아오고 저장
    //@Transactional
    public void fetchAndSaveStockData(List<String> stockCodes, String period, String interval) {
        
        // 모든 주식에 대해
        for (String stockCode : stockCodes) {
            // 주식 코드로 회사 정보 조회
            CompanyInformation company = companyInformationRepository.findByStockCode(stockCode).orElse(null);
            if(company != null) {
                fetchAndSaveStockDataForCompany(stockCode, company, period, interval);
            }
            
        }
    }
    
    // 특정 주식에 대한 시세 데이터 가져오고 저장
    //@Async
    public void fetchAndSaveStockDataForCompany(String stockCode, CompanyInformation company, String period, String interval) {
        Mono<String> dataMono = getFinanceData(stockCode, period, interval);
        try {
            String data = dataMono.block(); // 데이터를 가져올 때까지 블록킹 방식으로 대기
            
            if ("1h".equals(interval)) { //한시간 간격의 데이터일 경우(하루 or 5일)
                List<StockInformationH> stockData = parseStockData(data, company);//엔티티로 변환하여
                if ("1d".equals(period)) {//하루 데이터 받아오는 경우
                    StockInformationH newStock = stockData.get(stockData.size() - 1);//하루데이터 중 마지막 정보(최신정보)
                    //해당 타임의 회사 주식 시세 정보가 있는지 확인
                    StockInformationH checkRecord = stockInformationHRepository.findByCompanyInformationAndTimestamp(company, newStock.getTimestamp()).orElse(null);
                    if(checkRecord ==null){//해당 주식 시세 정보 없음.->최신 데이터(20분전 데이터)임
                        //9시 데이터면 이전 정보 없음
                        if (stockData.size()!=1){//9시 이후 데이터면->이전 데이터 확정
                            //변동된 이전 데이터
                            StockInformationH lastRecord = stockInformationHRepository.findByCompanyInformationAndTimestamp(company, stockData.get(stockData.size()-2).getTimestamp()).orElse(null);
                            if(lastRecord==null){
                                //예외
                            }
                            lastRecord.patch(stockData.get(stockData.size()-2));//확정된 데이터로 변경

                        }
                        stockInformationHRepository.save(newStock);//최신 데이터 저장;

                    }
                    else {//이미 해당 주식 시세 있음->마지막 시세를 최신정보로 업데이트
                        checkRecord.patch(newStock);
                    }
                    
                } else if ("5d".equals(period)) {//5일 데이터를 받아오는경우(최초)
                    stockInformationHRepository.saveAll(stockData);//전부 저장
                }
            } else if ("1d".equals(interval)) {//하루 간격의 데이터(하루 or 세달)
                List<StockInformationD> stockData = parseStockDataD(data, company);//엔티티로 변환하여
                if ("1d".equals(period)) {//하루 데이터 받아오는 경우
                    StockInformationD newStock = stockData.get(stockData.size() - 1);//하루데이터 중 마지막 정보(최신정보)만을 저장
                    //타임스탬프가 같은 회사의 주식시세 확인
                    StockInformationD checkRecord = stockInformationDRepository.findByCompanyInformationAndTimestamp(company, newStock.getTimestamp()).orElse(null);
                    if (checkRecord==null) {//같은 시간 정보가 없는 경우에만
                        stockInformationDRepository.save(newStock);//저장
                    }
                } else if ("3mo".equals(period)) {//세달 데이터를 받아오는경우(최초)
                    stockInformationDRepository.saveAll(stockData);//전부 저장
                }

            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch or save stock data for company: " + company.getStockCode(), e);
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

    //entity로 변환
    private List<StockInformationD> parseStockDataD(String data, CompanyInformation company) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            List<Map<String, Object>> list = mapper.readValue(data, new TypeReference<List<Map<String, Object>>>() {});
            List<StockInformationD> stockInfoList = new ArrayList<>();
            for (Map<String, Object> map : list) {
                StockInformationD stockInfo = new StockInformationD();
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
