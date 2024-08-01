package com.berich.stock_bot.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.berich.stock_bot.dto.AccountAccessTokenRequest;
import com.berich.stock_bot.dto.AccountAccessTokenResponse;
import com.berich.stock_bot.dto.AccountBalanceResponse;
import com.berich.stock_bot.dto.AccountRequest;
import com.berich.stock_bot.dto.BalanceResponse;
import com.berich.stock_bot.entity.Account;
import com.berich.stock_bot.entity.User;
import com.berich.stock_bot.repository.AccountRepository;
import com.berich.stock_bot.repository.UserRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuples;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebClient webClient_stock;


    //계좌 등록
    public void enrollAccount(String loginId, AccountRequest accountInfo) {
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if(user==null){
            //예외처리하기
        }
        //액세스 토큰 발급
        String appKey = accountInfo.getAppKey();
        //System.out.println("왜안돼"+appKey);
        String appSecret = accountInfo.getAppSecret();
        String accountNum = accountInfo.getAccountNum();
        //요청 body 생성
        AccountAccessTokenRequest body = new AccountAccessTokenRequest("client_credentials", appKey, appSecret);
        //System.out.println("진짜개앵애졸려"+body.getGrant_type()+body.getAppkey()+body.getAppsecret());
        // 액세스 토큰을 비동기적으로 발급받고, 발급 후 계좌 잔액 조회
        requestAccessToken(body)
            .flatMap(response -> {
                // 액세스 토큰을 추출하고 계좌 잔액을 조회
                String accessToken = response.getAccessToken();
                
                LocalDateTime expiredAt = response.getAccessTokenTokenExpired();

                return getAccountBalance(accessToken, accountNum, appKey, appSecret)
                    .map(balanceResponse -> Tuples.of(accessToken, expiredAt, balanceResponse));
            })
            .subscribe(
                tuple -> {
                    String accessToken = tuple.getT1();
                    LocalDateTime expiredAt = tuple.getT2();
                    //Long userId = tuple.getT3();
                    AccountBalanceResponse balanceResponse = tuple.getT3();

                    // 계좌 잔액 조회 성공
                    if ("0".equals(balanceResponse.getRtCd())) {
                        // Account 객체 생성 및 데이터베이스 저장
                        //Long accountN = Long.parseLong(accountNum);
                        Long userId = user.getId();
                        Account account = new Account(accountNum, appKey, appSecret, accessToken, expiredAt, userId);
                        accountRepository.save(account);
                    } else {
                        System.err.println("Error: " + balanceResponse.getMsg1());
                    }
                },
                error -> {
                    // 오류 발생 시 처리
                    System.err.println("Error occurred while fetching account balance: " + error.getMessage());
                    // 오류 처리 로직을 여기에 추가할 수 있습니다.
                }
            );
    }
    
    //잔액조회(전체목록)
    public AccountBalanceResponse accountBalance(String loginId) {
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if(user==null){
            //예외처리하기
            
        }
        Long userId = user.getId();
        Account account = accountRepository.findByUserId(userId).orElse(null);
        if(account ==null) {
            //예외처리:계좌 없음
        }
        
        return getAccountBalance(account.getAccountAccessToken(),account.getAccountNum(), account.getAppKey(), account.getAppSecret())
                .doOnError(error -> {
                    // 오류 발생
                    System.err.println("Error occurred while fetching account balance: " + error.getMessage());
                })
                .block(); // 동기적으로 

    }

    //잔액조회(전체 목록 중 특정 값)
    public BalanceResponse returnBalance(AccountBalanceResponse accountBalance) {
        if (accountBalance.getOutput2() != null && !accountBalance.getOutput2().isEmpty()) {
            // output2 첫번째리스트에서 반환
            AccountBalanceResponse.Output2Dto account = accountBalance.getOutput2().get(0);
            //예수금 총액
            String dncaTotAmt = account.getDncaTotAmt();
            //유가평가금액
            String sctsEvluAmt = account.getSctsEvluAmt();
            //총평가금액
            String totEvluAmt = account.getTotEvluAmt();
            //평가금액 합계금액
            String evluAmtSmtlAmt = account.getEvluAmtSmtlAmt();

            return new BalanceResponse(dncaTotAmt, sctsEvluAmt, totEvluAmt, evluAmtSmtlAmt);
        }
        return null;
    }

    //엑세스토큰 재발급(자동)
    @Scheduled(fixedRate = 7200000) // 2시간마다 실행 3600000=1시간
    public void updateAccountToken() {
        //System.out.println("제대로 호출되고 있다!");
        //Long a = Long.valueOf(2);
        
        //System.out.println("이건 원래 값"+ accountRepository.findById(a).orElse(null).getExpiredAt());
        //System.out.println("dddd"+ userRepository.findById(a).orElse(null).getBirthDate());
        LocalDateTime now = LocalDateTime.now();
        //System.out.println("현재시간!!!"+now);
        LocalDateTime thresholdTime = now.plusHours(2); // 현재시간보다 2시간 후에 만료되는 토큰에 대한 재요청
        //System.out.println("만료시간!!!"+ thresholdTime);
        // 만료 시간이 임박한 계좌들을 조회
        
        List<Account> accountList = accountRepository.findByExpiredAtBefore(thresholdTime);
        // System.out.println("만료시간222!!!"+ st);
        if (accountList.isEmpty()){
            System.out.println("리스트가 비었다요요요요");
        }
    
        //System.out.println("만료된 목록들"+accountList.size()+accountList.get(0).getExpiredAt()+accountList.get(0).getAccountNum());
        
        //조회된 계좌 리스트를 Flux로 변환하여 비동기적으로 처리
        Flux.fromIterable(accountList)
            .flatMap(account -> {
                // 액세스 토큰 요청을 비동기적으로 수행
                AccountAccessTokenRequest body = new AccountAccessTokenRequest("client_credentials", account.getAppKey(), account.getAppSecret());
                return requestAccessToken(body)
                    .doOnNext(response -> {
                        // 응답을 처리하여 계좌 정보를 갱신
                        account.setAccountAccessToken(response.getAccessToken());
                        //System.out.println("만료된 토큰 재발급"+response.getAccessTokenTokenExpired());
                        account.setExpiredAt(response.getAccessTokenTokenExpired());
                    })
                    .then(Mono.fromCallable(() -> accountRepository.save(account))); // 갱신된 계좌를 저장
            })
            .doOnError(error -> {
                // 에러 처리
                System.err.println("Error occurred while refreshing tokens: " + error.getMessage());
            })
            .subscribe(); // 구독하여 비동기 작업 시작
    
    }

    //엑세스토큰 post요청
    private Mono<AccountAccessTokenResponse> requestAccessToken(AccountAccessTokenRequest body) {
        return webClient_stock.post()
                .uri("/oauth2/tokenP")
                .bodyValue(body)
                .retrieve() //요청보내기
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
                .bodyToMono(AccountAccessTokenResponse.class); //응답 문자열 처리
                
    }

    private Mono<AccountBalanceResponse> getAccountBalance(String accessToken, String accountNum, String appKey, String appSecret) {
    
        return webClient_stock.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/uapi/domestic-stock/v1/trading/inquire-balance") // 엔드포인트 설정
                    .queryParam("CANO", accountNum) // 쿼리 파라미터 설정
                    .queryParam("ACNT_PRDT_CD", "01")
                    .queryParam("AFHR_FLPR_YN", "N")
                    .queryParam("OFL_YN")
                    .queryParam("INQR_DVSN", "01")
                    .queryParam("UNPR_DVSN", "01")
                    .queryParam("FUND_STTL_ICLD_YN","N")
                    .queryParam("FNCG_AMT_AUTO_RDPT_YN", "N")
                    .queryParam("PRCS_DVSN", "00")
                    .queryParam("CTX_AREA_FK100")
                    .queryParam("CTX_AREA_NK100")
                    .build()
                )
                .header("authorization", "Bearer " + accessToken)
                .header("appkey", appKey)
                .header("appsecret", appSecret)
                .header("tr_id", "VTTC8434R")
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
                .bodyToMono(AccountBalanceResponse.class); // 응답을 DTO로 처리
    }
                
                
    
}
