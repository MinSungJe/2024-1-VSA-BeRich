package com.berich.stock_bot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.berich.stock_bot.entity.AutoTradeInformation;

public interface AutoTradeInformationRepository extends JpaRepository<AutoTradeInformation, Long>{

    List<AutoTradeInformation> findByUserId(Long userId);
    Optional<AutoTradeInformation> findById(Long id);
}
