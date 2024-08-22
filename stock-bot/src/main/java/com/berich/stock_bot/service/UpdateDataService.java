package com.berich.stock_bot.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.berich.stock_bot.dto.BalanceResponse;
import com.berich.stock_bot.dto_python.AutoInvestRequest;
import com.berich.stock_bot.dto_python.DecisionResponse;
import com.berich.stock_bot.dto_stock.AccountBalanceResponse;
import com.berich.stock_bot.dto_stock.AutoInvestResponse;
import com.berich.stock_bot.entity.AutoTradeInformation;
import com.berich.stock_bot.entity.Decision;
import com.berich.stock_bot.entity.TradeRecord;
import com.berich.stock_bot.enums.AutoTradeStatus;
import com.berich.stock_bot.repository.AutoTradeInformationRepository;
import com.berich.stock_bot.repository.DecisionRepository;
import com.berich.stock_bot.repository.StockInformationDRepository;
import com.berich.stock_bot.repository.StockInformationHRepository;
import com.berich.stock_bot.repository.TradeRecordRepository;

@Service
public class UpdateDataService {

    @Autowired
    private CompanyInformationService companyInformationService;

    @Autowired
    private StockInformationService stockInformationService;

    @Autowired
    private StockInformationHRepository stockInformationHRepository;

    @Autowired
    private StockInformationDRepository stockInformationDRepository;

    @Autowired
    private AutoTradeInformationRepository autoTradeInformationRepository;

    @Autowired
    private TradeRecordRepository tradeRecordRepository;

    @Autowired
    private DecisionRepository decisionRepository;

    @Autowired
    private AutoInvestService autoInvestService;

    @Autowired
    private AccountService accountService;

    private List<String> stockCodes;

    //한시간마다(20분기준) 주식시세 업데이트(주말제외,9~2시까지)
    @Scheduled(cron = "0 20 9-15 ? * MON-FRI") //
    //@Async
    public void updateInformationH() {
        // 주식 코드 목록 조회
        if(stockCodes.isEmpty())
            stockCodes = companyInformationService.getAllStockCodes();
        // 주식 시세 데이터 요청 및 저장
        stockInformationService.fetchAndSaveStockData(stockCodes, "1d", "1h");

    }

    //하루마다 주식시세 업데이트(주말제외)
    @Scheduled(cron = "0 0 0 ? * MON-FRI") //
    //@Async
    public void updateInformationD() {
        // 주식 코드 목록 조회
        if(stockCodes.isEmpty())
            stockCodes = companyInformationService.getAllStockCodes();
        // 주식 시세 데이터 요청 및 저장
        stockInformationService.fetchAndSaveStockData(stockCodes, "1d", "1d");

    }

    //자정마다 오래된 주식시세 삭제(주말제외)
    @Scheduled(cron = "0 0 0 ? * MON-THU") // 주말제외 자정 실행
    @Async
    public void deleteBeforeData() {
        //가장 작은 timestamp 날짜 +1보다 작은 값 모두 삭제
        Long oldestTime = stockInformationHRepository.findMinTimestamp();
        Long threshold = oldestTime + 86400000;

        stockInformationHRepository.deleteByTimestampBefore(threshold);

        //가장 오래된 날짜(3개월 기준)
        Long oldestDay = stockInformationDRepository.findMinTimestamp();
        stockInformationDRepository.deleteByTimestamp(oldestDay);

    }

    //월-금 오전 9시에 종료예정 모두 팔기 ->종료로 변경
    @Scheduled(cron = "0 0 9 ? * MON-FRI")
    @Async
    public void sellEndStock() {
        //종료예정 목록
        List<AutoTradeInformation> endList = autoTradeInformationRepository.findByStatus(AutoTradeStatus.PENDING_END);
        if(!endList.isEmpty()){//있으면
            for (AutoTradeInformation autoInfo : endList) {
                autoInvestService.sellAllStock(autoInfo);
            }
        }

    }

    //월-금 오후 3시 20분에 만료일 오늘 모두 ->종료로 변경
    @Scheduled(cron = "0 20 15 ? * MON-FRI")
    @Async
    public void changeToEnd() {
        //오늘종료예정 목록
        LocalDate now = LocalDate.now();
        List<AutoTradeInformation> changeList = autoTradeInformationRepository.findByEndDay(now);
        if(!changeList.isEmpty()){//있으면
            for (AutoTradeInformation autoInfo : changeList) {
                autoInvestService.sellAllStock(autoInfo);
            }
        }

    }

    //월-금 오전 9,12,15시 10분에 엑티브 자동매매
    @Scheduled(cron = "0 10 9,12,15 ? * MON-FRI")
    @Async
    public void scheduledAutoStock() {
        //활성화 목록
        List<AutoTradeInformation> activeList = autoTradeInformationRepository.findByStatus(AutoTradeStatus.ACTIVE);
        if(!activeList.isEmpty()){//있으면
            for (AutoTradeInformation autoInfo : activeList) {
                AutoInvestRequest body = autoInvestService.makeInvestBody(autoInfo);
                DecisionResponse decisionResponse = autoInvestService.returnGptDecision(body);//응답결정
                //응답저장
                Decision decision = new Decision(LocalDateTime.now(),decisionResponse.getDecision(),decisionResponse.getPercentage(), decisionResponse.getReason(),autoInfo);
                decisionRepository.save(decision);
                //결정에 따른 매매 요청
                //매매 양
                int qty = 0;
                if (decisionResponse.getDecision().equals("buy")){
                    double psblNumber = Double.parseDouble(body.getAvailableBuyAmount());
                    double currentNumber = Double.parseDouble(body.getCurrentPrice());
                    qty = (int) ((psblNumber / currentNumber) * (decision.getPercentage()/ 100.0));
                } else if(decisionResponse.getDecision().equals("sell")){
                    //잔액 조회
                    AccountBalanceResponse balance = accountService.accountBalance(autoInfo.getUser().getLoginId());
                    // Output1Dto 목록 가져오기
                    List<AccountBalanceResponse.Output1Dto> output1List = balance.getOutput1();
                    String stockBalance ="0";
                    // 보유 수량 가져오기
                    if (output1List == null || output1List.isEmpty()) {
                        stockBalance ="0";
                    }

                    // 하나의 항목만 있어야 한다고 가정
                    if (output1List.size() != 1) {
                        throw new IllegalStateException("Expected exactly one Output1Dto item, but found: " + output1List.size());
                    }

                    // 첫 번째 항목에서 보유 수량 가져오기
                    stockBalance = output1List.get(0).getHldgQty();
                    int num = Integer.parseInt(stockBalance);
                    qty = (int) (num* decision.getPercentage() * 0.01);
                    
                }
                
                String amount = String.valueOf(qty);
                AutoInvestResponse investResponse = autoInvestService.returnInvestResult(autoInfo, decision,amount);
                //매매기록 저장
                if(investResponse.getRtCd().equals("0") && investResponse!=null){
                    //잔액 조회
                    AccountBalanceResponse balance = accountService.accountBalance(autoInfo.getUser().getLoginId());
                    // Output1Dto 목록 가져오기
                    List<AccountBalanceResponse.Output1Dto> output1List = balance.getOutput1();
                    String stockBalance ="0";
                    // 보유 수량 가져오기
                    if (output1List == null || output1List.isEmpty()) {
                        stockBalance ="0";
                    }

                    // 하나의 항목만 있어야 한다고 가정
                    if (output1List.size() != 1) {
                        throw new IllegalStateException("Expected exactly one Output1Dto item, but found: " + output1List.size());
                    }

                    // 첫 번째 항목에서 보유 수량 가져오기
                    stockBalance = output1List.get(0).getHldgQty();
                    
                    BalanceResponse balanceSmall = accountService.returnBalance(balance);
                    
                    TradeRecord tradeRecord = new TradeRecord(LocalDateTime.now(), amount , body.getCurrentPrice(), stockBalance, balanceSmall.getDncaTotAmt(), balanceSmall.getTotEvluAmt(), decision);
                    tradeRecordRepository.save(tradeRecord);
                    //총 수익률 변경 및저장
                    if (output1List == null || output1List.isEmpty()) {
                        
                    }else{
                        double total = Double.parseDouble(balanceSmall.getTotEvluAmt());
                        double start = Double.parseDouble(autoInfo.getStartBalance());
                        double profit = ((total - start) / start) * 100;
                        String totalProfit = String.valueOf(profit);
                        autoInfo.setTotalProfit(totalProfit);
                        autoTradeInformationRepository.save(autoInfo);

                    }
                    
                }
               
            }
        }

    }
}
