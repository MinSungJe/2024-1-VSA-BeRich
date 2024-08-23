package com.berich.stock_bot.dto_python;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.berich.stock_bot.entity.AutoTradeInformation;
import com.berich.stock_bot.entity.Decision;
import com.berich.stock_bot.entity.TradeRecord;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutoInvestRequest {
    // 자동매매 정보
    private String stockCode; // 종목 코드
    private LocalDate startDay; // 자동매매 시작일
    private LocalDateTime now; // 현재 날짜 및 시간
    private LocalDate endDay; // 자동매매 종료일
    private String investmentPropensity; // 투자 성향
    private String investmentInsight; // 주관적 예측
    private String startBalance; // 시작 잔고
    private String lastStockBalance;
    // 주식 정보
    private String companyNews; // 뉴스 요약본
    private String currentPrice; // 현재가
    private String availableBuyAmount; // 매수 가능 금액

    // 결정 - 매매 과거 기록
    private List<DecisionDTO> decisions; // 매매 결정 기록

    // 생성자
    public AutoInvestRequest(AutoTradeInformation autoTradeInformation, String companyNews, String currentPrice, String availableBuyAmount, String stockBalance) {
        this.stockCode = autoTradeInformation.getStockCode();
        this.startDay = autoTradeInformation.getStartDay();
        this.now = LocalDateTime.now(); // 현재 날짜 및 시간
        this.endDay = autoTradeInformation.getEndDay();
        this.investmentPropensity = autoTradeInformation.getInvestmentPropensity();
        this.investmentInsight = autoTradeInformation.getInvestmentInsight();
        this.startBalance = autoTradeInformation.getStartBalance();
        this.lastStockBalance = stockBalance;
        this.companyNews = companyNews;
        this.currentPrice = currentPrice;
        this.availableBuyAmount = availableBuyAmount;
        this.decisions = autoTradeInformation.getDecisions().stream()
            .map(DecisionDTO::new)
            .collect(Collectors.toList());
    }

    @Getter
    @Setter
    public static class DecisionDTO {
        private LocalDateTime decisionTime; // 결정 시각
        private String decision; // 결정 내용
        private double percentage; // 퍼센트
        private String reason; // 결정 이유
        private TradeRecordDTO tradeRecord; // 매매 기록

        public DecisionDTO(Decision decision) {
            this.decisionTime = decision.getDecisionTime();
            this.decision = decision.getDecision();
            this.percentage = decision.getPercentage();
            this.reason = decision.getReason();
            //System.out.println("두근두근 생성자");
            // tradeRecord가 null일 경우 null을 할당하거나 TradeRecordDTO를 null로 설정
            if(decision.getTradeRecord() != null) {
                this.tradeRecord =new TradeRecordDTO(decision.getTradeRecord());
            } else {
                //System.out.println("빈 기록");
                this.tradeRecord = null;
                //System.out.println("생성성공!");
            }
            
            //this.tradeRecord = 
        }
    }

    @Getter
    @Setter
    public static class TradeRecordDTO {
        private LocalDateTime tradeTime; // 매매 시각
        private String orderStock; // 주문 주식 수
        private String orderPrice; // 주문 단가
        private String stockBalance; // 현재 보유 주식
        private String cashBalance; // 현금 잔액
        private String totalBalance; // 주식 포함 잔고

        
        public TradeRecordDTO(TradeRecord tradeRecord) {
        
            this.tradeTime = tradeRecord.getTradeTime();
            this.orderStock = tradeRecord.getOrderStock();
            this.orderPrice = tradeRecord.getOrderPrice();
            this.stockBalance = tradeRecord.getStockBalance();
            this.cashBalance = tradeRecord.getCashBalance();
            this.totalBalance = tradeRecord.getTotalBalance();
        
        }
    }
    
}
