package com.berich.stock_bot.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.berich.stock_bot.entity.TradeRecord;

public interface TradeRecordRepository extends JpaRepository<TradeRecord, Long>{

    Optional<TradeRecord> findByDecisionId(Long decisionId);
}
