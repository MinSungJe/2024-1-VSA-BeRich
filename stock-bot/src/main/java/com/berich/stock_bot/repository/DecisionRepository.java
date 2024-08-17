package com.berich.stock_bot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.berich.stock_bot.entity.Decision;

public interface DecisionRepository  extends JpaRepository<Decision, Long> {

    List<Decision> findByAutoTradeInformationId(Long autoTradeInformationId);
      // decisionTime 기준으로 최신순 정렬
    List<Decision> findByAutoTradeInformationIdOrderByDecisionTimeDesc(Long autoTradeInformationId);
}
