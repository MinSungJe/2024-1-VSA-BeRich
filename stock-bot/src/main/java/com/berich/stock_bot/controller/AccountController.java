package com.berich.stock_bot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.berich.stock_bot.dto.AccountBalanceResponse;
import com.berich.stock_bot.dto.AccountRequest;
import com.berich.stock_bot.service.AccountService;

@RestController
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/api/accountB")
    public ResponseEntity<String> enrollAccount(@RequestBody AccountRequest accountRequest, @AuthenticationPrincipal UserDetails userDetail) {
        String a = accountRequest.getAppKey();
        
        accountService.enrollAccount(userDetail.getUsername(), accountRequest);

        return ResponseEntity.ok("계좌가 등록되었습니다.");
    }


    
    //잔액조회
    @GetMapping("/api/balance")
    public String getBalance(@AuthenticationPrincipal UserDetails userDetail) {
        AccountBalanceResponse response = accountService.accountBalance(userDetail.getUsername());
        if (response.getOutput2() != null && !response.getOutput2().isEmpty()) {
            // output2 리스트에서 첫 번째 항목의 순 자산 금액을 반환
            String nass_amt = response.getOutput2().get(0).getNassAmt();
            return "순자산: " + nass_amt;
        }
        return null; // output2 리스트가 비어있거나 null인 경우
        
    }
}
