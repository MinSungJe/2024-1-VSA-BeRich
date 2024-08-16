package com.berich.stock_bot.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StartTradeRequest {

    private String stockCode;//종목
    private LocalDate startDay;//시작일
    private LocalDate endDay;//기간->종료일
    private String investmentPropensity; //투자 성향
    private String investmentInsight; //주관적 예측

}
