package com.berich.stock_bot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.berich.stock_bot.entity.StockInformationH;
import com.berich.stock_bot.service.StockInformationService;

@RestController
public class StockInformationCotroller {


    @Autowired
    private StockInformationService stockInformationService;

    @GetMapping("/api/{stockCode}/graph-1mo")
    public ResponseEntity<List<StockInformationH>> return1MInfo(@PathVariable("stockCode") Long stockCode){
        //그래프 정보 가져오기
        String code = Long.toString(stockCode);
        List<StockInformationH> graphResponse = stockInformationService.getStock1MInfo(code);
        
        if (graphResponse.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        else {
            return ResponseEntity.ok(graphResponse);
        }
        
    }
}
