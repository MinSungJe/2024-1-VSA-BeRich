package com.berich.stock_bot.dto_stock;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class AutoInvestResponse {

    @JsonProperty("rt_cd")
    private String rtCd;       // 성공 실패 여부

    @JsonProperty("msg_cd")
    private String msgCd;      // 응답코드

    @JsonProperty("msg")
    private String msg;        // 응답메세지

    @JsonProperty("output")
    private List<Output> output; // 응답상세

    // Inner class for Output
    @Getter
    public static class Output {
        @JsonProperty("KRX_FWDG_ORD_ORGNO")
        private String krxFwdgOrdOrgno; // 한국거래소전송주문조직번호

        @JsonProperty("ODNO")
        private String odno;            // 주문번호

        @JsonProperty("ORD_TMD")
        private String ordTmd;          // 주문시각
    }

}
