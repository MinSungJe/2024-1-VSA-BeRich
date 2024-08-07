package com.berich.stock_bot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.berich.stock_bot.dto.AutoInvestRequest;
import com.berich.stock_bot.dto.MessageResponse;
import com.berich.stock_bot.entity.CompanyInformation;
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


    @PostMapping("/api/{company}/auto-stock")
    public ResponseEntity<MessageResponse> startAutoInvest(@RequestBody AutoInvestRequest request, @AuthenticationPrincipal UserDetails userDetail) {
        autoInvestService.startStockBot(request);
        return ResponseEntity.ok(new MessageResponse("자동매매가 시작되었습니다."));
    }

    
}
