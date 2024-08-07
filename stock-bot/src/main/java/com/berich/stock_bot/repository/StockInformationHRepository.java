package com.berich.stock_bot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.berich.stock_bot.entity.StockInformationH;

public interface StockInformationHRepository extends JpaRepository<StockInformationH, Long>{

    boolean existsByTimestamp(Long timestamp);
    
    @Query("SELECT MIN(s.timestamp) FROM StockInformationH s")
    Long findMinTimestamp();

    @Modifying
    @Transactional
    @Query("DELETE FROM StockInformationH s WHERE s.timestamp < :threshold")
    void deleteByTimestampBefore(@Param("threshold") Long threshold);
    

}
