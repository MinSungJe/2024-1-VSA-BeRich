package com.berich.stock_bot.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class CompanyInformation {

    @JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //기업 코드
    @Column( nullable =false,unique = true)
    private String stockCode;

    //기업 이름
    @Column( nullable =false,unique = true)
    private String companyName;

    //기업에 대한 간단한 설명 넣을까 말까...

    // 주식 시세와의 관계 설정 (일대다 관계)
    @JsonIgnore
    @OneToMany(mappedBy = "companyInformation", cascade = CascadeType.REMOVE) //같이 삭제
    private List<StockInformationH> stockInformationH = new ArrayList<>();
}
