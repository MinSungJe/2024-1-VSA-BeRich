package com.berich.stock_bot.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.berich.stock_bot.dto.StartTradeRequest;
import com.berich.stock_bot.dto_stock.AutoInvestResponse;
import com.berich.stock_bot.dto_stock.InvestRequest;
import com.berich.stock_bot.entity.Account;
import com.berich.stock_bot.entity.AutoTradeInformation;
import com.berich.stock_bot.entity.Decision;
import com.berich.stock_bot.entity.TradeRecord;
import com.berich.stock_bot.entity.User;
import com.berich.stock_bot.enums.AutoTradeStatus;
import com.berich.stock_bot.repository.AccountRepository;
import com.berich.stock_bot.repository.AutoTradeInformationRepository;
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

    //자동매매 기록
    //@Transectional
    public void startStockBot(StartTradeRequest request, String loginId) {
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if( user == null) {
            //에러처리: 유저가 없는 경우
        }
        //임시 정보!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        String startBalance = "200000";//현금잔고 또는 예수금 조회후 넣기
        //종목, 제한금액, 성향 보내면
        AutoTradeInformation autoTradeInformation = new AutoTradeInformation(request, startBalance, user);
        autoTradeInformationRepository.save(autoTradeInformation);//자동매매 기록
        //자동매매 실행-이유답변, invest 메소드 사용-해당 답변 및 매매기록 데베에 저장
        LocalDateTime tradeTime = LocalDateTime.now();

        Decision decision = new Decision(tradeTime,"buy", 20.0, "실험용으로 20을 사보겠어", autoTradeInformation);
        decisionRepository.save(decision);
        
        TradeRecord tradeRecord = new TradeRecord(tradeTime,"10","60000", "65", "5500000", "6100000", decision);
        tradeRecordRepository.save(tradeRecord);
    }

    //자동매매 정보 불러오기
    public List<AutoTradeInformation> getAutoTradeInformation(String loginId) {
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if( user == null) {
            //에러처리: 유저가 없는 경우
        }
        
        // 종료일을 기준으로 최신순으로 정렬된 목록을 반환
        return autoTradeInformationRepository.findByUserIdOrderByEndDayDesc(user.getId());
    }

    //자동매매 상세정보(결정및실제 매매 기록)불러오기
    public List<Decision> getTradeRecord(String loginId, Long autoTradeInformationId) {
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if( user == null) {
            //에러처리: 유저가 없는 경우
        }
        AutoTradeInformation autoInfo = autoTradeInformationRepository.findById(autoTradeInformationId).orElse(null);
        if( autoInfo == null){
            //해당 자동매매 없음
        }
        User checkUser = autoInfo.getUser();

        if (user.getId() != checkUser.getId()){
            //권한 없음
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
            throw new NoSuchElementException("AutoTradeInformation not found for id: " + autoTradeInformationId);
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

    private void stopAndSell(AutoTradeInformation autoInfo){
        LocalDateTime now = LocalDateTime.now();//현재시간
        DayOfWeek dayOfWeek = now.getDayOfWeek();//요일

        // 평일 (월요일~금요일) 오전 9시~오후 3시 사이 확인
        boolean isWeekday = dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY;
        boolean isWithinTradingHours =  now.getHour() >= 9 && now.getHour() < 15;

        if (isWeekday && isWithinTradingHours) {//즉시 팔 수 있으면 
        
            //종료 함수 즉시 불러오기
            sellAllStock(autoInfo);
        } else { //종료예정으로 차후 팔림
            autoInfo.setStatus(AutoTradeStatus.PENDING_END);
            autoTradeInformationRepository.save(autoInfo);
        }
    }

    //모든 주식 팔고 종료하기
    public void sellAllStock(AutoTradeInformation autoInfo){
        LocalDate now = LocalDate.now();//새로운 종료일
        // 매매 시 필요 정보
        Account account = accountRepository.findByUserId(autoInfo.getUser().getId()).orElse(null);
        if (account == null) {
            //등록된 계좌 없음 예외
        }
        String stockCode = autoInfo.getStockCode();
        String buyOrSell = "VTTC0801U";//매도
        String amount = "현재 보유 주식 모두 조회해서";
        
        //Mono<AutoInvestResponse> response = invest(account, stockCode, buyOrSell, amount);
        //결과 저장 및 종료
        autoInfo.setStatus(AutoTradeStatus.ENDED);//상태변경
        autoInfo.setEndDay(now);//종료일 변경

        autoTradeInformationRepository.save(autoInfo);


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

    //종목별 수익률
    public String getEarningRate(String stockCode, String loginId) {
        User user = userRepository.findByLoginId(loginId).orElse(null);
        if( user == null) {
            //에러처리: 유저가 없는 경우
        }

        // 사용자의 자동매매 목록 총 수익률 평균? 이익금액?
        return "130";
    }

    

}
