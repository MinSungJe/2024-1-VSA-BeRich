package com.berich.stock_bot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserInformationResponse {

    private String loginId;
    private String firstName;
    private String lastName;
    private String accountNum;
}
