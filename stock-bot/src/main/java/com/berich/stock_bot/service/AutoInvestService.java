package com.berich.stock_bot.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.berich.stock_bot.dto.BalanceResponse;
import com.berich.stock_bot.dto.StartTradeRequest;
import com.berich.stock_bot.dto_python.AutoInvestRequest;
import com.berich.stock_bot.dto_python.DecisionResponse;
import com.berich.stock_bot.dto_stock.AccountBalanceResponse;
import com.berich.stock_bot.dto_stock.AutoInvestResponse;
import com.berich.stock_bot.dto_stock.InvestRequest;
import com.berich.stock_bot.dto_stock.PresentPriceResponse;
import com.berich.stock_bot.dto_stock.PsblOrderResponse;
import com.berich.stock_bot.entity.Account;
import com.berich.stock_bot.entity.AutoTradeInformation;
import com.berich.stock_bot.entity.CompanyInformation;
import com.berich.stock_bot.entity.Decision;
import com.berich.stock_bot.entity.TradeRecord;
import com.berich.stock_bot.entity.User;
import com.berich.stock_bot.enums.AutoTradeStatus;
import com.berich.stock_bot.repository.AccountRepository;
import com.berich.stock_bot.repository.AutoTradeInformationRepository;
import com.berich.stock_bot.repository.CompanyInformationRepository;
import com.berich.stock_bot.repository.DecisionRepository;
import com.berich.stock_bot.repository.TradeRecordRepository;
import com.berich.stock_bot.repository.UserRepository;

import reactor.core.publisher.Mono;

@Service
public class AutoInvestService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AutoTradeInformationRepository autoTradeInformationRepository;

    @Autowired
    private DecisionRepository decisionRepository;

    @Autowired
    private TradeRecordRepository tradeRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebClient webClient_stock;

    @Autowired
    private WebClient webClient_py;

    @Autowired
    private AccountService accountService;

    @Autowired
    private CompanyInformationRepository companyInformationRepository;

    //자동매매 기록
    @Transactional
    public void startStockBot(StartTradeRequest request, String loginId) {
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if( user == null) {
            //에러처리: 유저가 없는 경우
            throw new NoSuchElementException("User not found for loginId: " + loginId);
        }
        //자동매매 정보
        AccountBalanceResponse response = accountService.accountBalance(loginId);
        AccountBalanceResponse.Output2Dto account = response.getOutput2().get(0);
        //예수금 총액(미수거래로, d+2예수금으로 변경)-시작 잔고
        String startBalance = account.getPrvsRcdlExccAmt();
        //종목, 제한금액, 성향 보내면
        AutoTradeInformation autoTradeInformation = new AutoTradeInformation(request, startBalance, user);
        autoTradeInformationRepository.save(autoTradeInformation);//자동매매 기록-자동 active
        
    }

    //active인 자동매매 기록에 대해 주기적 결정 요청 보내기 9:10,12:10.15:10 월-금 -> 그에 따른 매매

    // 결정요청 바디 만들기
    public AutoInvestRequest makeInvestBody(AutoTradeInformation autoTradeInfo){
        User user = autoTradeInfo.getUser(); //해당 자동매매의 사용자
        Account account = accountRepository.findByUserId(user.getId()).orElse(null);//계좌
        if(account ==null){
            throw new NoSuchElementException("Account not found");
        }
        CompanyInformation company = companyInformationRepository.findByStockCode(autoTradeInfo.getStockCode()).orElse(null);
        if(company == null){
            throw new NoSuchElementException("Company not found");
        }
        String summary = company.getCompanyNews().getSummary();//뉴스 요약본
        //현재가 조회
        String currentPrice = returnPresentPrice(account, autoTradeInfo.getStockCode()).getOutput().getStckPrpr();
        //매수가능금액 조회
        String psblOrderAmount = returnPsblOrderSync(account, autoTradeInfo.getStockCode()).getOutput().getOrdPsblCash();
        AutoInvestRequest body = new AutoInvestRequest(autoTradeInfo, summary, currentPrice, psblOrderAmount);
        return body;
    }
    //파이썬에 결정요청
    private Mono<DecisionResponse> requestDecision(AutoInvestRequest body) {
    
        return webClient_py.post()
                .uri("/api/gpt-decision") // 엔드포인트 설정
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
                .bodyToMono(DecisionResponse.class); // 응답을 DTO로 처리
    }

     // 결정 조회 응답값
    public DecisionResponse returnGptDecision(AutoInvestRequest body) {
        try {
            return requestDecision(body)//결정 요청
                    .block(); // 동기적으로 응답을 기다림
        } catch (Exception e) {
            // 예외 처리
            System.err.println("Error occurred while fetching decision request: " + e.getMessage());
            // 필요에 따라 예외를 재던지거나 적절한 처리 수행
            throw new RuntimeException("Failed to fetch decision request", e);
        }
    }

    //자동매매 정보 불러오기
    public List<AutoTradeInformation> getAutoTradeInformation(String loginId) {
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if( user == null) {
            //에러처리: 유저가 없는 경우
            throw new NoSuchElementException("User not found for loginId: " + loginId);
        }
        
        // 종료일을 기준으로 최신순으로 정렬된 목록을 반환
        return autoTradeInformationRepository.findByUserIdOrderByEndDayDesc(user.getId());
    }

    //자동매매 상세정보(결정및실제 매매 기록)불러오기
    public List<Decision> getTradeRecord(String loginId, Long autoTradeInformationId) {
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if( user == null) {
            //에러처리: 유저가 없는 경우
            throw new NoSuchElementException("User not found for loginId: " + loginId);
        }
        AutoTradeInformation autoInfo = autoTradeInformationRepository.findById(autoTradeInformationId).orElse(null);
        if( autoInfo == null){
            //해당 자동매매 없음
            throw new NoSuchElementException("AutoTradeInformation not found");
        }
        User checkUser = autoInfo.getUser();

        if (user.getId() != checkUser.getId()){
            //권한 없음
            throw new SecurityException("User is not authorized.");
        }
        
         // decisionTime을 기준으로 최신순 정렬된 목록을 반환
        return decisionRepository.findByAutoTradeInformationIdOrderByDecisionTimeDesc(autoTradeInformationId);
    }

    //자동매매 중단하기
    public void stopStockBot(String loginId, Long autoTradeInformationId) {
    
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if( user == null) {
            //에러처리: 유저가 없는 경우
            throw new NoSuchElementException("User not found for loginId: " + loginId);
        }
        AutoTradeInformation autoInfo = autoTradeInformationRepository.findById(autoTradeInformationId).orElse(null);
        if( autoInfo == null){
            //해당 자동매매 없음
            throw new NoSuchElementException("AutoTradeInformation not found");
        }
        User checkUser = autoInfo.getUser();

        if (user.getId() != checkUser.getId()){
            //권한 없음
            throw new SecurityException("User is not authorized to stop this auto trade.");
        }
        if (autoInfo.getStatus() == AutoTradeStatus.ACTIVE) {
            stopAndSell(autoInfo);

        } else {
             //이미 종료된 자동매매 예외처리
            throw new IllegalStateException("The auto trade is already ended.");
        }
        
    }

    //종료하고 시간대별로 종료함수 호출
    private void stopAndSell(AutoTradeInformation autoInfo){
        LocalDateTime now = LocalDateTime.now();//현재시간
        DayOfWeek dayOfWeek = now.getDayOfWeek();//요일

        // 평일 (월요일~금요일) 오전 9시~오후 3시 사이 확인
        boolean isWeekday = dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY;
        boolean isWithinTradingHours = (now.getHour() > 9 || (now.getHour() == 9 && now.getMinute() >= 0)) &&
                                (now.getHour() < 15 || (now.getHour() == 15 && now.getMinute() < 30));
        System.out.println("가능날짜"+isWeekday+isWithinTradingHours);
        //잔액 조회
        AccountBalanceResponse balance = accountService.accountBalance(autoInfo.getUser().getLoginId());
        
        // Output1Dto 목록 가져오기
        List<AccountBalanceResponse.Output1Dto> output1List = balance.getOutput1();
        String stockBalance ="0";
        if (isWeekday && isWithinTradingHours) {//즉시 팔 수 있으면 
            System.out.println("팔거야!");
            //종료 함수 즉시 불러오기
            sellAllStock(autoInfo);
        } 
        else { //종료예정으로 차후 팔림
            if(output1List == null || output1List.isEmpty()){//소유주식 없음

                Decision decision = new Decision(LocalDateTime.now(),"stop",0, "종료 요청",autoInfo);
                decisionRepository.save(decision);                
                autoInfo.setStatus(AutoTradeStatus.ENDED);
                autoInfo.setEndDay(LocalDate.now());//종료일 변경
                autoTradeInformationRepository.save(autoInfo);
            }else{
                 // 첫 번째 항목에서 보유 수량 가져오기
                stockBalance = output1List.get(0).getHldgQty();
                if (stockBalance.equals("0")){//보유주식 없으면
                    Decision decision = new Decision(LocalDateTime.now(),"stop",0, "종료 요청",autoInfo);
                    decisionRepository.save(decision);   
                    autoInfo.setStatus(AutoTradeStatus.ENDED);
                    autoTradeInformationRepository.save(autoInfo);                    
                }else{
                    autoInfo.setStatus(AutoTradeStatus.PENDING_END);
                    autoInfo.setEndDay(LocalDate.now());//종료일 변경
                    autoTradeInformationRepository.save(autoInfo);

                }
            }
            
        }
    }

    //모든 주식 팔고 종료하기
    @Transactional
    public void sellAllStock(AutoTradeInformation autoInfo){
        LocalDate now = LocalDate.now();//새로운 종료일
        // 매매 시 필요 정보
        Account account = accountRepository.findByUserId(autoInfo.getUser().getId()).orElse(null);
        if (account == null) {
            //등록된 계좌 없음 
            throw new NoSuchElementException("Account not found");
        }
        String stockCode = autoInfo.getStockCode();
        // String buyOrSell = "VTTC0801U";//매도
        // //잔액 조회
        // AccountBalanceResponse balance = accountService.accountBalance(autoInfo.getUser().getLoginId());
        // //System.out.println("여기까지 성공!");
        // // Output1Dto 목록 가져오기
        // List<AccountBalanceResponse.Output1Dto> output1List = balance.getOutput1();
        // String stockBalance ="10";
        // // 보유 수량 가져오기
        // if (output1List == null || output1List.isEmpty()) {
        //     stockBalance ="0";
        // }

        // // 하나의 항목만 있어야 한다고 가정
        // if (output1List.size() != 1) {
        //     throw new IllegalStateException("Expected exactly one Output1Dto item, but found: " + output1List.size());
        // }

        
        
        // // 첫 번째 항목에서 보유 수량 가져오기
        // stockBalance = output1List.get(0).getHldgQty();
        String stockBalance ="10";
        if (!stockBalance.equals("0")){//보유주식 있으면
            //응답저장
            //System.out.println("여기까지는느느느느느 성공!");
            Decision decision = new Decision(LocalDateTime.now(),"sell",100, "종료 요청",autoInfo);
            decisionRepository.save(decision);
            AutoInvestResponse response = returnInvestResult(autoInfo, decision, stockBalance);
            //System.out.println("응답출력"+response);
            //새로잔액 조회
            AccountBalanceResponse balance2 = accountService.accountBalance(autoInfo.getUser().getLoginId());
            BalanceResponse balanceSmall = accountService.returnBalance(balance2);
            TradeRecord tradeRecord = new TradeRecord(LocalDateTime.now(), stockBalance , returnPresentPrice(account, stockCode).getOutput().getStckPrpr(), stockBalance, balanceSmall.getDncaTotAmt(), balanceSmall.getTotEvluAmt(), decision);
            tradeRecordRepository.save(tradeRecord);            
            double total = Double.parseDouble(balanceSmall.getTotEvluAmt());
            double start = Double.parseDouble(autoInfo.getStartBalance());
            double profit = ((total - start) / start) * 100;
            String totalProfit = String.valueOf(profit);
            autoInfo.setTotalProfit(totalProfit);
            autoTradeInformationRepository.save(autoInfo);
        }else {//보유주식 없음
            //응답저장
            Decision decision = new Decision(LocalDateTime.now(),"stop",0, "종료 요청",autoInfo);
            decisionRepository.save(decision);
        }
        
        
        
        //결과 저장 및 종료
        autoInfo.setStatus(AutoTradeStatus.ENDED);//상태변경
        autoInfo.setEndDay(now);//종료일 변경

        autoTradeInformationRepository.save(autoInfo);


    }
    

    //한투에 매매요청
    private Mono<AutoInvestResponse> invest(Account account, String stockCode, String buyOrSell, String amount) {
    
        InvestRequest body = new InvestRequest(account.getAccountNum(), "01", stockCode, "01", amount ,"0" );
        System.out.println("자 이게 출력이야"+body+buyOrSell+"양"+amount);
        return webClient_stock.post()
                .uri("/uapi/domestic-stock/v1/trading/order-cash") // 엔드포인트 설정
                .header("authorization", "Bearer " + account.getAccountAccessToken())
                .header("appkey", account.getAppKey())
                .header("appsecret", account.getAppSecret())
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

     // 매매요청 응답값
    public AutoInvestResponse returnInvestResult(AutoTradeInformation autoTradeInfo, Decision decision, String amount) {
        try {
            System.out.println("도대체 문제가 뭐야"+autoTradeInfo+decision);
            Account account = accountRepository.findByUserId(autoTradeInfo.getUser().getId()).orElse(null);
            if (account == null) {
                //등록된 계좌 없음 
                throw new NoSuchElementException("Account not found");
            }
            String buyOrSell = null;
            String decisionString = decision.getDecision();
            
            if(decisionString.equals("buy")){
                buyOrSell = "VTTC0802U";//매수
            } else if(decisionString.equals("sell")){
                buyOrSell = "VTTC0801U";//매도
                //System.out.println("파는거 변환 성공");
            } else if (decisionString.equals("hold")){
                return null;
            }
            

            return invest(account,autoTradeInfo.getStockCode(),buyOrSell,amount)//결정 요청
                    .block(); // 동기적으로 응답을 기다림
        } catch (Exception e) {
            // 예외 처리
            System.err.println("Error occurred while fetching decision request: " + e.getMessage());
            // 필요에 따라 예외를 재던지거나 적절한 처리 수행
            throw new RuntimeException("Failed to fetch decision request", e);
        }
    }

    //한투에 매수가능조회 - 주문가능 현금잔고 필요
    private Mono<PsblOrderResponse> getPsblOrder(Account account, String stockCode) {
    
        return webClient_stock.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/uapi/domestic-stock/v1/trading/inquire-psbl-order") // 엔드포인트 설정
                    .queryParam("CANO", account.getAccountNum()) // 쿼리 파라미터 설정
                    .queryParam("ACNT_PRDT_CD", "01")
                    .queryParam("PDNO", stockCode)//종목번호
                    .queryParam("ORD_UNPR")//주문단가
                    .queryParam("ORD_DVSN", "01")//주문구분-시장가
                    .queryParam("CMA_EVLU_AMT_ICLD_YN","Y")//cma평가금액 포함
                    .queryParam("OVRS_ICLD_YN", "Y")//해외포함여부
                    .build()
                )
                .header("authorization", "Bearer " + account.getAccountAccessToken())
                .header("appkey", account.getAppKey())
                .header("appsecret", account.getAppSecret())
                .header("tr_id", "VTTC8908R")//매수가능조회
                .header("custtype", "P")
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
                .bodyToMono(PsblOrderResponse.class); // 응답을 DTO로 처리
    }

     // 매수 가능 조회 응답값
    public PsblOrderResponse returnPsblOrderSync(Account account, String stockCode) {
        try {
            return getPsblOrder(account, stockCode)//조회
                    .block(); // 동기적으로 응답을 기다림
        } catch (Exception e) {
            // 예외 처리
            System.err.println("Error occurred while fetching possible order: " + e.getMessage());
            // 필요에 따라 예외를 재던지거나 적절한 처리 수행
            throw new RuntimeException("Failed to fetch possible order", e);
        }
    }

     //한투에 현재가조회 - stock-prpr필요
    private Mono<PresentPriceResponse> getPresentPrice(Account account, String stockCode) {
    
        return webClient_stock.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/uapi/domestic-stock/v1/quotations/inquire-price") // 엔드포인트 설정
                    .queryParam("FID_COND_MRKT_DIV_CODE", "J") // 쿼리 파라미터 설정- FID 조건 시장 분류 코드
                    .queryParam("FID_INPUT_ISCD", stockCode)//FID 입력 종목코드-종목코드
                    .build()
                )
                .header("authorization", "Bearer " + account.getAccountAccessToken())
                .header("appkey", account.getAppKey())
                .header("appsecret", account.getAppSecret())
                .header("tr_id", "FHKST01010100")//주식 현재가 시세
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
                .bodyToMono(PresentPriceResponse.class); // 응답을 DTO로 처리
    }

     // 현재가 조회 응답값
    public PresentPriceResponse returnPresentPrice(Account account, String stockCode) {
        try {
            return getPresentPrice(account, stockCode)//조회
                    .block(); // 동기적으로 응답을 기다림
        } catch (Exception e) {
            // 예외 처리
            System.err.println("Error occurred while fetching possible order: " + e.getMessage());
            // 필요에 따라 예외를 재던지거나 적절한 처리 수행
            throw new RuntimeException("Failed to fetch possible order", e);
        }
    }
    
    //종목별 수익률-최근 매매 수익률 그대로 반영
    public String getEarningRate(String stockCode, String loginId) {
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if( user == null) {
            //에러처리: 유저가 없는 경우
            throw new NoSuchElementException("User not found for loginId: " + loginId);
        }
        
        // 사용자 ID와 주식 코드로 목록을 조회하고 최신일자로 정렬
        List<AutoTradeInformation> autoTradeInformations = autoTradeInformationRepository.findByUserIdAndStockCodeOrderByEndDayDesc(user.getId(), stockCode);

        if (autoTradeInformations.isEmpty()) {
            return "거래 없음"; // 목록이 비어 있을 경우 0 반환
        }

        // 가장 최근 일자의 totalProfit 반환
        AutoTradeInformation mostRecentInfo = autoTradeInformations.get(0);
        return mostRecentInfo.getTotalProfit();
        
    }

    

}
