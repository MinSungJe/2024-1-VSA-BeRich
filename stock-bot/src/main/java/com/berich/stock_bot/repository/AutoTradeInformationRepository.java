package com.berich.stock_bot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.berich.stock_bot.entity.AutoTradeInformation;

public interface AutoTradeInformationRepository extends JpaRepository<AutoTradeInformation, Long>{

    List<AutoTradeInformation> findByUserId(Long userId);
    Optional<AutoTradeInformation> findById(Long id);
    // 종료일 기준으로 최신순 정렬
    List<AutoTradeInformation> findByUserIdOrderByEndDayDesc(Long userId);
}
