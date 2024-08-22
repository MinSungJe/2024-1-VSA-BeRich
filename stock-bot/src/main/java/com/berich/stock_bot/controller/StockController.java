package com.berich.stock_bot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.berich.stock_bot.dto.EarningRateResponse;
import com.berich.stock_bot.dto.MessageResponse;
import com.berich.stock_bot.dto.StartTradeRequest;
import com.berich.stock_bot.dto_stock.AutoInvestResponse;
import com.berich.stock_bot.dto_stock.PresentPriceResponse;
import com.berich.stock_bot.dto_stock.PsblOrderResponse;
import com.berich.stock_bot.entity.Account;
import com.berich.stock_bot.entity.AutoTradeInformation;
import com.berich.stock_bot.entity.CompanyInformation;
import com.berich.stock_bot.entity.Decision;
import com.berich.stock_bot.entity.User;
import com.berich.stock_bot.repository.AccountRepository;
import com.berich.stock_bot.repository.AutoTradeInformationRepository;
import com.berich.stock_bot.repository.CompanyInformationRepository;
import com.berich.stock_bot.repository.DecisionRepository;
import com.berich.stock_bot.repository.UserRepository;
import com.berich.stock_bot.service.AutoInvestService;

@RestController
public class StockController {

    @Autowired
    private AutoInvestService autoInvestService;
    @Autowired
    private CompanyInformationRepository companyInformationRepository;
    //테스트용 아래
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AutoTradeInformationRepository autoTradeInformationRepository;
    @Autowired
    private DecisionRepository decisionRepository;

    @GetMapping("/api/stock-list")
    public ResponseEntity<List<CompanyInformation>> getStockList(){
        return ResponseEntity.ok(companyInformationRepository.findAll());
    }


    //자동매매 시작하기
    @PostMapping("/api/auto-stock")
    public ResponseEntity<MessageResponse> startAutoInvest(@RequestBody StartTradeRequest request, @AuthenticationPrincipal UserDetails userDetail) {
        autoInvestService.startStockBot(request, userDetail.getUsername());
        return ResponseEntity.ok(new MessageResponse("자동매매가 시작되었습니다."));
    }

    //자동매매 중단
    @PatchMapping("api/{autoTradeId}/stop-bot")
    public ResponseEntity<MessageResponse> stopAutoInvest(@PathVariable("autoTradeId") Long autoTradeInformationId, @AuthenticationPrincipal UserDetails userDetail) {
        autoInvestService.stopStockBot(userDetail.getUsername(), autoTradeInformationId);
        return ResponseEntity.ok(new MessageResponse("자동매매가 중지되었습니다."));
    }

    //자동매매 기록(목록) 불러오기
    @GetMapping("api/auto-trade-information")
    public ResponseEntity<List<AutoTradeInformation>> getAutoTradeInfo(@AuthenticationPrincipal UserDetails userDetail) {
        List<AutoTradeInformation> autoTradeInformationList = autoInvestService.getAutoTradeInformation(userDetail.getUsername());
        //기록 없을경우, 매매기록 없다고 보내주기.예외처리
        if (autoTradeInformationList.isEmpty()){
            return ResponseEntity.noContent().build(); //204 상태코드
        }
        return ResponseEntity.ok(autoTradeInformationList);
    }

    //자동매매 상세기록 불러오기
    @GetMapping("api/trade-record/{autoTradeId}")
    public ResponseEntity<List<Decision>> getTradeRecord(@PathVariable("autoTradeId") Long autoTradeInformationId, @AuthenticationPrincipal UserDetails userDetail) {
        List<Decision> decisionList = autoInvestService.getTradeRecord(userDetail.getUsername(), autoTradeInformationId);
        //기록 없을경우, 매매기록 없다고 보내주기.예외처리
        if (decisionList.isEmpty()){
            return ResponseEntity.noContent().build(); //204 상태코드
        }
        return ResponseEntity.ok(decisionList);
    }

    //종목별 수익률
    @GetMapping("api/profit/{stockCode}")
    public ResponseEntity<EarningRateResponse> getEarningRate(@PathVariable("stockCode") String stockCode, @AuthenticationPrincipal UserDetails userDetail) {
        String earning = autoInvestService.getEarningRate(stockCode, userDetail.getUsername());
        return ResponseEntity.ok(new EarningRateResponse(earning));
    }

    //test로 확인 매수가능조회
    @GetMapping("api/test/psblorder/{stockCode}")
    public ResponseEntity<PsblOrderResponse> returnPsbl(@PathVariable("stockCode") String stockCode, @AuthenticationPrincipal UserDetails userDetail) {
        User user = userRepository.findByLoginId(userDetail.getUsername()).orElse(null);
        Account account = accountRepository.findByUserId(user.getId()).orElse(null);
        return ResponseEntity.ok( autoInvestService.returnPsblOrderSync(account,stockCode));
    }

    //test로 확인 현재가조회
    @GetMapping("api/test/presentPrice/{stockCode}")
    public ResponseEntity<PresentPriceResponse> returnPresentP(@PathVariable("stockCode") String stockCode, @AuthenticationPrincipal UserDetails userDetail) {
        User user = userRepository.findByLoginId(userDetail.getUsername()).orElse(null);
        Account account = accountRepository.findByUserId(user.getId()).orElse(null);
        return ResponseEntity.ok( autoInvestService.returnPresentPrice(account,stockCode));
    }

    //test로 확인 현재가조회
    @GetMapping("api/test/invest")
    public ResponseEntity<AutoInvestResponse> investTest(@AuthenticationPrincipal UserDetails userDetail) {
        User user = userRepository.findByLoginId(userDetail.getUsername()).orElse(null);
        //Account account = accountRepository.findByUserId(user.getId()).orElse(null);
        System.out.println("여기까지는 성공!!!");
        Long num1 = Long.valueOf(4);
        Long num2 =Long.valueOf(22);
        System.out.println("여기까지는 성공");
        AutoTradeInformation autoTradeInfo = autoTradeInformationRepository.findById(num1).orElse(null);
        System.out.println("여기까지는 성공");
        Decision decision = decisionRepository.findById(num2).orElse(null);
        System.out.println("여기까지 성공");
        return ResponseEntity.ok( autoInvestService.returnInvestResult(autoTradeInfo,decision,"10"));
    }
}
