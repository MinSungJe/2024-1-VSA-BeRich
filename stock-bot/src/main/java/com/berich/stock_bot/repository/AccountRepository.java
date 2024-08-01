package com.berich.stock_bot.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import com.berich.stock_bot.entity.Account;


public interface AccountRepository extends JpaRepository<Account, Long>{

    Optional<Account> findByUserId(Long userId);
    Optional<Account> findById(Long id);
    // @Query(value="SELECT * FROM ACCOUNT WHERE EXPIREDAT <= :thresholdTime", nativeQuery = true)
    // List<Account> findByExpiredAtBefore(@Param("thresholdTime") LocalDateTime thresholdTime);

    
    //Optional<Account> findByExpiredAte(@Param("st") String st);
    // @Query(value = "SELECT * FROM account WHERE expired_at <= :st ",nativeQuery=true)
    // List<Account> findByExpiredAtBefored(@Param("st") String thresholdTime);
    //List<Account> findByExpiredAtLessThanEqual(Timestamp thresholdTime);
    //Optional<Account> findByExpiredAt(LocalDateTime ex);
    List<Account> findByExpiredAtBefore(LocalDateTime thresholdTime);
    void deleteByUserId(Long userId);
}
