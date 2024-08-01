package com.berich.stock_bot.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
//@NoArgsConstructor
public class AccountRequest {

    private String accountNum;
    private String appKey;
    private String appSecret;
}
