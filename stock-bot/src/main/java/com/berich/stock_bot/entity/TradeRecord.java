package com.berich.stock_bot.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class TradeRecord {

    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;


    //매매시각
    @Column(nullable = false)
    private LocalDateTime tradeTime;

    //주문주식수
    @Column(nullable = false)
    private String orderStock;

    //주문단가
    @Column(nullable = false)
    private String orderPrice;

    //현재 보유 주식
    @Column(nullable = false)
    private String stockBalance;

    //현금잔액
    @Column(nullable = false)
    private String cashBalance;

    //주식포함 잔고
    @Column(nullable = false)
    private String totalBalance;

     // 개별 결정과의 관계 설정
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "decision_id", nullable = false)//
    private Decision decision;

    public TradeRecord(LocalDateTime tradeTime, String orderStock, String orderPrice, String stockBalance, String cashBalance, String totalBalance, Decision decision){
        this.tradeTime = tradeTime;
        this.orderStock = orderStock;
        this.orderPrice = orderPrice;
        this.stockBalance = stockBalance;
        this.cashBalance = cashBalance;
        this.totalBalance = totalBalance;
        this.decision = decision;
    }
}
