package com.berich.stock_bot.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class StockInformationH {

    @JsonIgnore
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;//자동 아이디

    @Column(nullable = false)
    private Long timestamp;

    @Column
    private Double open;

    @Column
    private Double high;

    @Column
    private Double low;

    @Column
    private Double close;

    @Column
    private Long volume;

    // 주식 기본 정보와의 관계 설정
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "company_information_id", nullable = false)
    private CompanyInformation companyInformation;
}
