package com.berich.stock_bot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.berich.stock_bot.dto.EarningRateResponse;
import com.berich.stock_bot.dto.MessageResponse;
import com.berich.stock_bot.dto.StartTradeRequest;
import com.berich.stock_bot.entity.AutoTradeInformation;
import com.berich.stock_bot.entity.CompanyInformation;
import com.berich.stock_bot.entity.Decision;
import com.berich.stock_bot.repository.CompanyInformationRepository;
import com.berich.stock_bot.service.AutoInvestService;

@RestController
public class StockController {

    @Autowired
    private AutoInvestService autoInvestService;
    @Autowired
    private CompanyInformationRepository companyInformationRepository;

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
}
