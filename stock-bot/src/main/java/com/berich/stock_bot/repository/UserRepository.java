package com.berich.stock_bot.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.berich.stock_bot.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByLoginId(String longinId);
    //Optional<User> findByEmail(String email);
    boolean existsByLoginId(String loginId);
    boolean existsByEmail(String email);

}
