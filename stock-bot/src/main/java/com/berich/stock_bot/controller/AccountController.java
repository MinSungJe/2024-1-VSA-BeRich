package com.berich.stock_bot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.berich.stock_bot.dto.BalanceResponse;
import com.berich.stock_bot.dto.MessageResponse;
import com.berich.stock_bot.dto_stock.AccountBalanceResponse;
import com.berich.stock_bot.dto_stock.AccountRequest;
import com.berich.stock_bot.entity.User;
import com.berich.stock_bot.repository.UserRepository;
import com.berich.stock_bot.service.AccountService;

@RestController
public class AccountController {

    @Autowired
    private AccountService accountService;
    
    @Autowired
    private UserRepository userRepository;


    //계좌 등록
    @PostMapping("/api/account")
    public ResponseEntity<MessageResponse> enrollAccount(@RequestBody AccountRequest accountRequest, @AuthenticationPrincipal UserDetails userDetail) {
        //String a = accountRequest.getAppKey();
        
        accountService.enrollAccount(userDetail.getUsername(), accountRequest);

        return ResponseEntity.ok(new MessageResponse("계좌가 등록되었습니다."));
    }


    
    //잔액조회
    @GetMapping("/api/balance")
    public ResponseEntity<BalanceResponse> getBalance(@AuthenticationPrincipal UserDetails userDetail) {
        AccountBalanceResponse response = accountService.accountBalance(userDetail.getUsername());//잔액 전체 값 반환
        BalanceResponse balance = accountService.returnBalance(response);//필요한 값들만 반환
        if (balance == null) {
            //예외처리
            // output2 리스트가 비어있거나 null인 경우
        }
        return ResponseEntity.ok(balance);
    }

    //계좌 삭제
    @DeleteMapping("api/accout-delete")
    public ResponseEntity<MessageResponse> deleteAccount(@AuthenticationPrincipal UserDetails userDetail) {
        
        User user = userRepository.findByLoginId(userDetail.getUsername()).orElse(null);
        accountService.deleteAccount(user);//유저 전달
        return ResponseEntity.ok(new MessageResponse("계좌가 삭제 되었습니다."));
    }

}
