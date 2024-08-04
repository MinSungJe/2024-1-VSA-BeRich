package com.berich.stock_bot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.berich.stock_bot.entity.StockInformationD;
import com.berich.stock_bot.entity.StockInformationH;
import com.berich.stock_bot.service.StockInformationService;

@RestController
public class StockInformationCotroller {


    @Autowired
    private StockInformationService stockInformationService;

    @GetMapping("/api/{stockCode}/graph-5d")
    public ResponseEntity<List<StockInformationH>> return5DInfo(@PathVariable("stockCode") String stockCode){
        //그래프 정보 가져오기
        List<StockInformationH> graphResponse = stockInformationService.getStock5DInfo(stockCode);
        
        if (graphResponse.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        else {
            return ResponseEntity.ok(graphResponse);
        }
        
    }

    @GetMapping("/api/{stockCode}/graph-3mo")
    public ResponseEntity<List<StockInformationD>> return3MInfo(@PathVariable("stockCode") String stockCode){
        //그래프 정보 가져오기
        List<StockInformationD> graphResponse = stockInformationService.getStock3MInfo(stockCode);
        
        if (graphResponse.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        else {
            return ResponseEntity.ok(graphResponse);
        }
        
    }
}
