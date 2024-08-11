package com.berich.stock_bot.dto_python;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutoInvestRequest {

    private String userType; //투자 성향
    private String LimitCach; //제한금액
    private String stockCode; //종목 코드
}
