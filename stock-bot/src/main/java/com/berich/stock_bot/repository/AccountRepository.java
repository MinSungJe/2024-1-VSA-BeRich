package com.berich.stock_bot.repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.berich.stock_bot.entity.Account;


public interface AccountRepository extends JpaRepository<Account, Long>{

    Optional<Account> findByUserId(Long userId);

    @Query(value = "SELECT * FROM account WHERE expired_at < :thresholdTime", nativeQuery = true)
    List<Account> findByExpiredAtBefore(@Param("thresholdTime") LocalDateTime thresholdTime);
    //List<Account> findByExpiredAtBefore(LocalDateTime thresholdTime);
    void deleteByUserId(Long userId);
}
