package com.berich.stock_bot.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.berich.stock_bot.entity.CompanyInformation;

public interface CompanyInformationRepository extends JpaRepository<CompanyInformation, Long> {

    Optional<CompanyInformation> findByStockCode(String stockCode);
    
}
