package com.berich.stock_bot.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.berich.stock_bot.entity.AutoTradeInformation;
import com.berich.stock_bot.enums.AutoTradeStatus;

public interface AutoTradeInformationRepository extends JpaRepository<AutoTradeInformation, Long>{

    List<AutoTradeInformation> findByUserId(Long userId);
    Optional<AutoTradeInformation> findById(Long id);
    // 종료일 기준으로 최신순 정렬
    List<AutoTradeInformation> findByUserIdOrderByEndDayDesc(Long userId);
    List<AutoTradeInformation> findByStatus(AutoTradeStatus status);
    List<AutoTradeInformation> findByEndDay(LocalDate today);
    // 사용자 ID와 주식 코드로 목록을 조회하고, 종료일 기준으로 내림차순 정렬
    List<AutoTradeInformation> findByUserIdAndStockCodeOrderByEndDayDesc(Long userId, String stockCode);
    // 특정 사용자 ID로 상태가 ACTIVE 또는 PENDING_END인 AutoTradeInformation 목록을 찾는 메서드
    List<AutoTradeInformation> findByUserIdAndStatusIn(Long userId, List<AutoTradeStatus> statuses);
}
