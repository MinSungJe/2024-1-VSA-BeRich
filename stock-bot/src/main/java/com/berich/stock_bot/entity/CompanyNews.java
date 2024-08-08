package com.berich.stock_bot.entity;

import java.time.LocalDate;

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
public class CompanyNews {


    @JsonIgnore
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;//자동 아이디

    @Column(nullable = false) //뉴스 요약본 날짜
    private LocalDate date;

    @Column(nullable = false, columnDefinition = "TEXT")//뉴스 요약본
    private String summary;

    // 회사 정보와의 관계 설정
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "company_information_id", nullable = false)//주식 코드 받아서 회사 정보로 저장
    private CompanyInformation companyInformation;
}
