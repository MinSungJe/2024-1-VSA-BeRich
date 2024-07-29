package com.berich.stock_bot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class BalanceResponse {
    String dncaTotAmt;//예수금 총액
    String sctsEvluAmt;//유가평가금액
    String totEvluAmt;//총평가금액
    String evluAmtSmtlAmt; //평가금액합계금액
}
