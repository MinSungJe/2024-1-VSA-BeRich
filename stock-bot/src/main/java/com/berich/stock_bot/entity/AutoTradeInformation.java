package com.berich.stock_bot.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.berich.stock_bot.dto.StartTradeRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
public class AutoTradeInformation {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    
    @Column(nullable =false)
    private String stockCode;//종목

    //시작일
    @Column(nullable = false, updatable=false)
    private LocalDate startDay;
    
    //종료일 ->중단할 경우 업데이트
    @Column(nullable = false, updatable=true)
    private LocalDate endDay;

    //투자성향
    @Column(nullable =true, columnDefinition = "TEXT")
    private String investmentPropensity;

    //주관적예측
    @Column(nullable =true, columnDefinition = "TEXT")
    private String investmentInsight;
    
    //시작 잔고
    @Column(nullable = false)
    private String startBalance;

    @Column(updatable = true)
    private String totalProfit;

    // 활성화 상태
    @Column(nullable = false, updatable = true)
    private boolean isActive;

    //매매결정기록 매핑
    @JsonIgnore
    @OneToMany(mappedBy = "autoTradeInformation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Decision> decisions = new ArrayList<>();

    //사용자 매핑
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY) // 지연로딩
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 사용자와의 다대일 관계
    

    public AutoTradeInformation(StartTradeRequest request, String startBalance, User user) {
        this.stockCode = request.getStockCode();
        this.startDay = request.getStartDay();
        this.endDay = request.getEndDay();
        this.investmentPropensity = request.getInvestmentPropensity();
        this.investmentInsight = request.getInvestmentInsight();
        this.startBalance = startBalance;
        this.user = user;
        this.totalProfit = "수익 없음";
        this.isActive = true;

    }

    public User getUser() {
        //throw new UnsupportedOperationException("Not supported yet.");
        return user;
    }
}
