package com.berich.stock_bot.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.berich.stock_bot.entity.CompanyInformation;
import com.berich.stock_bot.entity.CompanyNews;
import com.berich.stock_bot.repository.CompanyInformationRepository;
import com.berich.stock_bot.repository.CompanyNewsRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;

@Service
public class CompanyNewsService {

    @Autowired
    private CompanyNewsRepository companyNewsRepository;
    @Autowired
    private CompanyInformationRepository companyInformationRepository;
    @Autowired
    private WebClient webClient_py;

    public CompanyNews returnCompanyNews(String stockCode) {

        CompanyInformation company = companyInformationRepository.findByStockCode(stockCode).orElse(null);
        if (company==null){
            //예외처리
        }
        CompanyNews news = companyNewsRepository.findByCompanyInformationId(company.getId()).orElse(null);
        if (news==null){
            //예외
        }
        return news;
    }

    @Scheduled(cron = "0 0 8 ? * MON-FRI")//오전 8시
    public void getNewsScheduled(){
        companyNewsRepository.deleteAll();//기존 뉴스 삭제
        
        Mono<String> dataMono = getCompanyNews();
        try {
            String data = dataMono.block();
            List<CompanyNews> newsData = parseStockData(data);//엔티티로 변환하여
            companyNewsRepository.saveAll(newsData);
        }catch (Exception e) {
            throw new RuntimeException("Failed to fetch or save stock data for company: ");
        }
    }

    private Mono<String> getCompanyNews() {
        // Flask API에 GET 요청을 보내고 응답을 Mono<String>으로 반환
        return webClient_py.get()
            .uri(uriBuilder -> uriBuilder
                .path("/api/news-summary")
                .build())
            .retrieve()
            .bodyToMono(String.class)
            .onErrorResume(e -> Mono.error(new RuntimeException("Failed to fetch finance data", e)));
    }

    //entity로 변환
    private List<CompanyNews> parseStockData(String data) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            // JSON 응답을 Map으로 변환
            Map<String, Object> map = mapper.readValue(data, new TypeReference<Map<String, Object>>() {});
            List<Map<String, Object>> list = (List<Map<String, Object>>) map.get("data");
            //List<Map<String, Object>> list = mapper.readValue(data, new TypeReference<List<Map<String, Object>>>() {});
            List<CompanyNews> companyNewsList = new ArrayList<>();
            for (Map<String, Object> item : list) {
                CompanyInformation company = companyInformationRepository.findByStockCode((String) item.get("code")).orElse(null);
                if (company==null){
                    //예외처리
                }
                CompanyNews news = new CompanyNews();
                news.setDate(LocalDate.now());//뉴스 요약본 날짜 기록
                news.setSummary((String) item.get("summary"));
                news.setCompanyInformation(company);
                companyNewsList.add(news);
            }
            return companyNewsList;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse stock data", e);
        }
    }
}
