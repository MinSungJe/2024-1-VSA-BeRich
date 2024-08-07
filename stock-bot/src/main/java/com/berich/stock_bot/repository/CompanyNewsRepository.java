package com.berich.stock_bot.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.berich.stock_bot.entity.CompanyNews;

public interface CompanyNewsRepository extends JpaRepository<CompanyNews, Long> {

    Optional<CompanyNews> findByCompanyInformationId(Long companyInformationId);
    
}
