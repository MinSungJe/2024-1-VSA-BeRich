package com.berich.stock_bot.dto_stock;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
@Setter
public class InvestRequest {

    @JsonProperty("CANO")
    private String cano;

    @JsonProperty("ACNT_PRDT_CD")
    private String acntPrdtCd;
    
    @JsonProperty("PDNO")
    private String pdno;

    @JsonProperty("ORD_DVSN")
    private String ordDvsn;

    @JsonProperty("ORD_QTY")
    private String ordQty;

    @JsonProperty("ORD_UNPR")
    private String ordUnpr;
}
