package com.berich.stock_bot.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class Decision {

    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    //결정
    @Column(nullable =false)
    private String decision;

    //퍼센테이지
    @Column(nullable =false)
    private double percentage;

    //결정이유
    @Column(nullable =false,  columnDefinition = "TEXT")
    private String reason;

     // 개별 자동매매와의 관계 설정
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "auto_trade_information_id", nullable = false)//
    private AutoTradeInformation autoTradeInformation;

    // 매매결정기록 매핑, 이유랑 내용 같이 반환하기
    @OneToOne(mappedBy = "decision", cascade = CascadeType.ALL, orphanRemoval = true)
    private TradeRecord tradeRecord;

    public Decision(String decision, double percentage, String reason, AutoTradeInformation autoTradeInformation){
        this.decision = decision;
        this.percentage = percentage;
        this.reason = reason;
        this.autoTradeInformation = autoTradeInformation;
    }
}
