package com.berich.stock_bot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.berich.stock_bot.dto.CreateAccessTokenRequest;
import com.berich.stock_bot.dto.CreateAccessTokenResponse;
import com.berich.stock_bot.service.TokenService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class TokenApiController {
    private final TokenService tokenService;
    
    //토큰 재요청
    @PostMapping("/api/token")
    public ResponseEntity<CreateAccessTokenResponse> createNewAccessToken(@RequestBody CreateAccessTokenRequest request) {
        String newAccessToken = tokenService.createNewAccessToken(request.getRefreshToken());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(new CreateAccessTokenResponse(newAccessToken));
    }
}
