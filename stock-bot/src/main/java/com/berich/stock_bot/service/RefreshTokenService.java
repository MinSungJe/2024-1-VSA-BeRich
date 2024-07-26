package com.berich.stock_bot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.berich.stock_bot.entity.RefreshToken;
import com.berich.stock_bot.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    public RefreshToken findByRefreshToken(String refreshToken) {
        return refreshTokenRepository.findByRefreshToken(refreshToken)
            .orElseThrow(() -> new IllegalArgumentException("토큰 없음"));
    }

    public void saveRefreshToken(Long userId, String refreshToken) {
        RefreshToken refreshTokenSave = refreshTokenRepository.findByUserId(userId).orElse(null);

        if (refreshTokenSave==null) {
            refreshTokenRepository.save(new RefreshToken(userId, refreshToken));
        } else {
            refreshTokenSave.update(refreshToken);
        }
        
    }
    
}
