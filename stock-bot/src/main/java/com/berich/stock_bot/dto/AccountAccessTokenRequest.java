package com.berich.stock_bot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccountAccessTokenRequest {

    private String grant_type;
    private String appkey;
    private String appsecret;
}
