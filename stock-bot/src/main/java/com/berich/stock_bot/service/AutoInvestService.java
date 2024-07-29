package com.berich.stock_bot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.berich.stock_bot.dto.AutoInvestRequest;
import com.berich.stock_bot.dto.AutoInvestResponse;
import com.berich.stock_bot.dto.InvestRequest;
import com.berich.stock_bot.entity.Account;
import com.berich.stock_bot.repository.AccountRepository;
import com.berich.stock_bot.repository.UserRepository;

import reactor.core.publisher.Mono;

@Service
public class AutoInvestService {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebClient webClient_stock;

    //@Transectional
    public void startStockBot(AutoInvestRequest request) {
        //종목, 제한금액, 성향 보내면 얼마나 매매할지랑 이유 답변 -userid랑 같이 보내고 
        //매매 실행하고 invest 메소드 사용
        //해당 답변저장 데베에 저장
    }


    private Mono<AutoInvestResponse> invest(Account account, String stockCode, String buyOrSell, String amount) {
    
        InvestRequest body = new InvestRequest(account.getAccountNum(), "01", stockCode, "01", amount ,"0" );
        
        return webClient_stock.post()
                .uri("/uapi/domestic-stock/v1/trading/order-cash") // 엔드포인트 설정
                .header("authorization", "Bearer " + account.getAccountAccessToken())
                .header("appkey", account.getAppKey())
                .header("appsecret", account.getAppKey())
                .header("tr_id", buyOrSell) //매수 또는 매도
                .bodyValue(body)
                .retrieve()
                .onStatus(
                    status -> status.is4xxClientError(),
                    clientResponse -> clientResponse.bodyToMono(String.class)
                        .flatMap(errorResponse -> {
                            // 클라이언트 오류 처리 (4xx)
                            return Mono.error(new RuntimeException("Client error: " + errorResponse));
                        })
                )
                .onStatus(
                    status -> status.is5xxServerError(),
                    clientResponse -> clientResponse.bodyToMono(String.class)
                        .flatMap(errorResponse -> {
                            // 서버 오류 처리 (5xx)
                            return Mono.error(new RuntimeException("Server error: " + errorResponse));
                        })
                )
                .bodyToMono(AutoInvestResponse.class); // 응답을 DTO로 처리
    }

    

}
