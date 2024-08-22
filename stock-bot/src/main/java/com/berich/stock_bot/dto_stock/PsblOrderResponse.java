package com.berich.stock_bot.dto_stock;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PsblOrderResponse {
     // Header
    //private String contentType;  // content-type: 컨텐츠 타입
    //private String trId;         // tr_id: 거래 ID
    //private String trCont;       // tr_cont: 연속 거래 여부
    //private String gtUid;        // gt_uid: Global UID

    @JsonProperty("rt_cd")
    private String rtCd;         // 성공 실패 여부

    @JsonProperty("msg_cd")
    private String msgCd;        // 응답코드

    @JsonProperty("msg1")
    private String msg1;         // 응답메세지

    @JsonProperty("output")
    private Output output;       // 응답 상세

    @Getter
    @Setter
    @ToString
    public static class Output {

        @JsonProperty("ord_psbl_cash")
        private String ordPsblCash;          // 주문가능현금

        @JsonProperty("ord_psbl_sbst")
        private String ordPsblSbst;          // 주문가능대용

        @JsonProperty("ruse_psbl_amt")
        private String rusePsblAmt;          // 재사용가능금액

        @JsonProperty("fund_rpch_chgs")
        private String fundRpchChgs;         // 펀드환매대금

        @JsonProperty("psbl_qty_calc_unpr")
        private String psblQtyCalcUnpr;      // 가능수량계산단가

        @JsonProperty("nrcvb_buy_amt")
        private String nrcvbBuyAmt;          // 미수없는매수금액

        @JsonProperty("nrcvb_buy_qty")
        private String nrcvbBuyQty;          // 미수없는매수수량

        @JsonProperty("max_buy_amt")
        private String maxBuyAmt;            // 최대매수금액

        @JsonProperty("max_buy_qty")
        private String maxBuyQty;            // 최대매수수량

        @JsonProperty("cma_evlu_amt")
        private String cmaEvluAmt;           // CMA평가금액

        @JsonProperty("ovrs_re_use_amt_wcrc")
        private String ovrsReUseAmtWcrc;     // 해외재사용금액원화

        @JsonProperty("ord_psbl_frcr_amt_wcrc")
        private String ordPsblFrcrAmtWcrc;   // 주문가능외화금액원화
    }
}
