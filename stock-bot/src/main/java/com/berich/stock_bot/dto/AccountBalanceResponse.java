package com.berich.stock_bot.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountBalanceResponse {
    // 응답의 성공 여부를 나타내는 코드입니다.
    @JsonProperty("rt_cd")
    private String rtCd;

    // 응답 코드입니다.
    @JsonProperty("msg_cd")
    private String msgCd;

    // 응답 메시지입니다.
    @JsonProperty("msg1")
    private String msg1;

    // 연속조회검색조건100
    @JsonProperty("ctx_area_fk100")
    private String ctxAreaFk100;

    // 연속조회키100
    @JsonProperty("ctx_area_nk100")
    private String ctxAreaNk100;

    // 응답 상세1 (상품 관련 정보)
    @JsonProperty("output1")
    private List<Output1Dto> output1;

    // 응답 상세2 (금액 및 자산 관련 정보)
    @JsonProperty("output2")
    private List<Output2Dto> output2;

    /**
     * 응답 상세1을 표현하는 내부 DTO 클래스입니다.
     */
    @Getter
    @Setter
    public static class Output1Dto {

        // 상품 번호 (종목번호의 뒷 6자리)
        @JsonProperty("pdno")
        private String pdno;

        // 상품명 (종목명)
        @JsonProperty("prdt_name")
        private String prdtName;

        // 매매구분명 (매수매도 구분)
        @JsonProperty("trad_dvsn_name")
        private String tradDvsnName;

        // 전일 매수 수량
        @JsonProperty("bfdy_buy_qty")
        private String bfdyBuyQty;

        // 전일 매도 수량
        @JsonProperty("bfdy_sll_qty")
        private String bfdySllQty;

        // 금일 매수 수량
        @JsonProperty("thdt_buyqty")
        private String thdtBuyqty;

        // 금일 매도 수량
        @JsonProperty("thdt_sll_qty")
        private String thdtSllQty;

        // 보유 수량--------------------------------------
        @JsonProperty("hldg_qty")
        private String hldgQty;

        // 주문 가능 수량
        @JsonProperty("ord_psbl_qty")
        private String ordPsblQty;

        // 매입 평균 가격
        @JsonProperty("pchs_avg_pric")
        private String pchsAvgPric;

        // 매입 금액
        @JsonProperty("pchs_amt")
        private String pchsAmt;

        // 현재 가격
        @JsonProperty("prpr")
        private String prpr;

        // 평가 금액
        @JsonProperty("evlu_amt")
        private String evluAmt;

        // 평가 손익 금액 (평가 금액 - 매입 금액)
        @JsonProperty("evlu_pfls_amt")
        private String evluPflsAmt;

        // 평가 손익 율
        @JsonProperty("evlu_pfls_rt")
        private String evluPflsRt;

        // 평가 수익 율
        @JsonProperty("evlu_erng_rt")
        private String evluErngRt;

        // 대출 일자 (조회 구분을 01로 설정해야 값이 나옴)
        @JsonProperty("loan_dt")
        private String loanDt;

        // 대출 금액
        @JsonProperty("loan_amt")
        private String loanAmt;

        // 대주 매각 대금
        @JsonProperty("stln_slng_chgs")
        private String stlnSlngChgs;

        // 만기 일자
        @JsonProperty("expd_dt")
        private String expdDt;

        // 등락율
        @JsonProperty("fltt_rt")
        private String flttRt;

        // 전일 대비 증감
        @JsonProperty("bfdy_cprs_icdc")
        private String bfdyCprsIcdc;

        // 종목 증거금율명
        @JsonProperty("item_mgna_rt_name")
        private String itemMgnaRtName;

        // 보증금율명
        @JsonProperty("grta_rt_name")
        private String grtaRtName;

        // 대용 가격
        @JsonProperty("sbst_pric")
        private String sbstPric;

        // 주식 대출 단가
        @JsonProperty("stck_loan_unpr")
        private String stckLoanUnpr;
    }

    /**
     * 응답 상세2를 표현하는 내부 DTO 클래스입니다.
     */
    @Getter
    @Setter
    public static class Output2Dto {

        // 예수금 총 금액-------------------------------------------------
        @JsonProperty("dnca_tot_amt")
        private String dncaTotAmt;

        // 익일 정산 금액
        @JsonProperty("nxdy_excc_amt")
        private String nxdyExccAmt;

        // 가수도 정산 금액
        @JsonProperty("prvs_rcdl_excc_amt")
        private String prvsRcdlExccAmt;

        // CMA 평가 금액
        @JsonProperty("cma_evlu_amt")
        private String cmaEvluAmt;

        // 전일 매수 금액
        @JsonProperty("bfdy_buy_amt")
        private String bfdyBuyAmt;

        // 금일 매수 금액
        @JsonProperty("thdt_buy_amt")
        private String thdtBuyAmt;

        // 익일 자동 상환 금액
        @JsonProperty("nxdy_auto_rdpt_amt")
        private String nxdyAutoRdptAmt;

        // 전일 매도 금액
        @JsonProperty("bfdy_sll_amt")
        private String bfdySllAmt;

        // 금일 매도 금액
        @JsonProperty("thdt_sll_amt")
        private String thdtSllAmt;

        // D+2 자동 상환 금액
        @JsonProperty("d2_auto_rdpt_amt")
        private String d2AutoRdptAmt;

        // 전일 제 비용 금액
        @JsonProperty("bfdy_tlex_amt")
        private String bfdyTlexAmt;

        // 금일 제 비용 금액
        @JsonProperty("thdt_tlex_amt")
        private String thdtTlexAmt;

        // 총 대출 금액
        @JsonProperty("tot_loan_amt")
        private String totLoanAmt;

        // 유가 평가 금액----------------------------------------
        @JsonProperty("scts_evlu_amt")
        private String sctsEvluAmt;

        // 총 평가 금액----------------------------
        @JsonProperty("tot_evlu_amt")
        private String totEvluAmt;

        // 순 자산 금액----
        @JsonProperty("nass_amt")
        private String nassAmt;

        // 융자금 자동 상환 여부
        @JsonProperty("fncg_gld_auto_rdpt_yn")
        private String fncgGldAutoRdptYn;

        // 매입 금액 합계 금액
        @JsonProperty("pchs_amt_smtl_amt")
        private String pchsAmtSmtlAmt;

        // 평가 금액 합계 금액----------------------------------------------
        @JsonProperty("evlu_amt_smtl_amt")
        private String evluAmtSmtlAmt;

        // 평가 손익 합계 금액
        @JsonProperty("evlu_pfls_smtl_amt")
        private String evluPflsSmtlAmt;

        // 총 대주 매각 대금
        @JsonProperty("tot_stln_slng_chgs")
        private String totStlnSlngChgs;

        // 전일 총 자산 평가 금액
        @JsonProperty("bfdy_tot_asst_evlu_amt")
        private String bfdyTotAsstEvluAmt;

        // 자산 증감액
        @JsonProperty("asst_icdc_amt")
        private String asstIcdcAmt;

        // 자산 증감 수익율
        @JsonProperty("asst_icdc_erng_rt")
        private String asstIcdcErngRt;
    }
}
