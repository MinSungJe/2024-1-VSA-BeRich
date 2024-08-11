package com.berich.stock_bot.dto_stock;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InvestRequest {

    private String cano;
    private String acntPrdtCd;
    private String pdno;
    private String ordDvsn;
    private String ordQty;
    private String ordUnpr;
}
