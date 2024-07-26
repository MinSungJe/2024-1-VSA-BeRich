package com.berich.stock_bot.dto;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class LoginRequest {

    private String loginId;
    private String password;
}
