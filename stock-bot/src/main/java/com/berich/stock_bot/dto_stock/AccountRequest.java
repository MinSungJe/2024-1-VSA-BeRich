package com.berich.stock_bot.dto_stock;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
//@NoArgsConstructor
public class AccountRequest {

    private String accountNum;
    private String appKey;
    private String appSecret;
}
