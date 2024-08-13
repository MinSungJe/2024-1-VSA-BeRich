package com.berich.stock_bot.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.berich.stock_bot.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{

    Optional<RefreshToken> findByUserId(Long userId); //사용자 고유 아이디로 찾기
    Optional<RefreshToken> findByRefreshToken(String refreshToken);//리프레시 토큰으로 찾기
}
