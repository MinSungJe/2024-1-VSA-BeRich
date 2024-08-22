package com.berich.stock_bot.dto_python;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DecisionResponse {

    private String decision;     // 결정 (buy, sell 등)
    private double percentage;   // 퍼센트
    private String reason;       // 결정 이유
}
