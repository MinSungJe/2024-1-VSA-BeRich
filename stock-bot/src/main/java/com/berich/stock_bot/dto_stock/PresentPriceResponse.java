package com.berich.stock_bot.dto_stock;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class PresentPriceResponse {

    @JsonProperty("rt_cd")
    private String rtCd;         // 성공 실패 여부 (0 : 성공, 0 이외의 값 : 실패)

    @JsonProperty("msg_cd")
    private String msgCd;        // 응답코드

    @JsonProperty("msg1")
    private String msg1;         // 응답메세지

    @JsonProperty("output")
    private Output output;       // 응답상세

    @Getter
    @Setter
    @ToString
    public static class Output {

        @JsonProperty("iscd_stat_cls_code")
        private String iscdStatClsCode; // 종목 상태 구분 코드

        @JsonProperty("marg_rate")
        private String margRate;         // 증거금 비율

        @JsonProperty("rprs_mrkt_kor_name")
        private String rprsMrktKorName;  // 대표 시장 한글 명

        @JsonProperty("new_hgpr_lwpr_cls_code")
        private String newHgprLwprClsCode; // 신 고가 저가 구분 코드

        @JsonProperty("bstp_kor_isnm")
        private String bstpKorIsnm;      // 업종 한글 종목명

        @JsonProperty("temp_stop_yn")
        private String tempStopYn;       // 임시 정지 여부

        @JsonProperty("oprc_rang_cont_yn")
        private String oprcRangContYn;   // 시가 범위 연장 여부

        @JsonProperty("clpr_rang_cont_yn")
        private String clprRangContYn;   // 종가 범위 연장 여부

        @JsonProperty("crdt_able_yn")
        private String crdtAbleYn;       // 신용 가능 여부

        @JsonProperty("grmn_rate_cls_code")
        private String grmnRateClsCode;  // 보증금 비율 구분 코드

        @JsonProperty("elw_pblc_yn")
        private String elwPblcYn;        // ELW 발행 여부

        @JsonProperty("stck_prpr")
        private String stckPrpr;         // 주식 현재가

        @JsonProperty("prdy_vrss")
        private String prdyVrss;         // 전일 대비

        @JsonProperty("prdy_vrss_sign")
        private String prdyVrssSign;     // 전일 대비 부호

        @JsonProperty("prdy_ctrt")
        private String prdyCtrt;         // 전일 대비율

        @JsonProperty("acml_tr_pbmn")
        private String acmlTrPbmn;       // 누적 거래 대금

        @JsonProperty("acml_vol")
        private String acmlVol;         // 누적 거래량

        @JsonProperty("prdy_vrss_vol_rate")
        private String prdyVrssVolRate; // 전일 대비 거래량 비율

        @JsonProperty("stck_oprc")
        private String stckOprc;         // 주식 시가

        @JsonProperty("stck_hgpr")
        private String stckHgpr;         // 주식 최고가

        @JsonProperty("stck_lwpr")
        private String stckLwpr;         // 주식 최저가

        @JsonProperty("stck_mxpr")
        private String stckMxpr;         // 주식 상한가

        @JsonProperty("stck_llam")
        private String stckLlam;         // 주식 하한가

        @JsonProperty("stck_sdpr")
        private String stckSdpr;         // 주식 기준가

        @JsonProperty("wghn_avrg_stck_prc")
        private String wghnAvrgStckPrc;  // 가중 평균 주식 가격

        @JsonProperty("hts_frgn_ehrt")
        private String htsFrgnEhrt;      // HTS 외국인 소진율

        @JsonProperty("frgn_ntby_qty")
        private String frgnNtbyQty;      // 외국인 순매수 수량

        @JsonProperty("pgtr_ntby_qty")
        private String pgtrNtbyQty;      // 프로그램매매 순매수 수량

        @JsonProperty("pvt_scnd_dmrs_prc")
        private String pvtScndDmrsPrc;   // 피벗 2차 디저항 가격

        @JsonProperty("pvt_frst_dmrs_prc")
        private String pvtFrstDmrsPrc;   // 피벗 1차 디저항 가격

        @JsonProperty("pvt_pont_val")
        private String pvtPontVal;       // 피벗 포인트 값

        @JsonProperty("pvt_frst_dmsp_prc")
        private String pvtFrstDmspPrc;   // 피벗 1차 디지지 가격

        @JsonProperty("pvt_scnd_dmsp_prc")
        private String pvtScndDmspPrc;   // 피벗 2차 디지지 가격

        @JsonProperty("dmrs_val")
        private String dmrsVal;         // 디저항 값

        @JsonProperty("dmsp_val")
        private String dmspVal;         // 디지지 값

        @JsonProperty("cpfn")
        private String cpfn;            // 자본금

        @JsonProperty("rstc_wdth_prc")
        private String rstcWdthPrc;     // 제한 폭 가격

        @JsonProperty("stck_fcam")
        private String stckFcam;        // 주식 액면가

        @JsonProperty("stck_sspr")
        private String stckSspr;        // 주식 대용가

        @JsonProperty("aspr_unit")
        private String asprUnit;        // 호가단위

        @JsonProperty("hts_deal_qty_unit_val")
        private String htsDealQtyUnitVal; // HTS 매매 수량 단위 값

        @JsonProperty("lstn_stcn")
        private String lstnStcn;        // 상장 주수

        @JsonProperty("hts_avls")
        private String htsAvls;         // HTS 시가총액

        @JsonProperty("per")
        private String per;            // PER

        @JsonProperty("pbr")
        private String pbr;            // PBR

        @JsonProperty("stac_month")
        private String stacMonth;      // 결산 월

        @JsonProperty("vol_tnrt")
        private String volTnrt;        // 거래량 회전율

        @JsonProperty("eps")
        private String eps;            // EPS

        @JsonProperty("bps")
        private String bps;            // BPS

        @JsonProperty("d250_hgpr")
        private String d250Hgpr;       // 250일 최고가

        @JsonProperty("d250_hgpr_date")
        private String d250HgprDate;   // 250일 최고가 일자

        @JsonProperty("d250_hgpr_vrss_prpr_rate")
        private String d250HgprVrssPrprRate; // 250일 최고가 대비 현재가 비율

        @JsonProperty("d250_lwpr")
        private String d250Lwpr;       // 250일 최저가

        @JsonProperty("d250_lwpr_date")
        private String d250LwprDate;   // 250일 최저가 일자

        @JsonProperty("d250_lwpr_vrss_prpr_rate")
        private String d250LwprVrssPrprRate; // 250일 최저가 대비 현재가 비율

        @JsonProperty("stck_dryy_hgpr")
        private String stckDryyHgpr;   // 주식 연중 최고가

        @JsonProperty("dryy_hgpr_vrss_prpr_rate")
        private String dryyHgprVrssPrprRate; // 연중 최고가 대비 현재가 비율

        @JsonProperty("dryy_hgpr_date")
        private String dryyHgprDate;   // 연중 최고가 일자

        @JsonProperty("stck_dryy_lwpr")
        private String stckDryyLwpr;   // 주식 연중 최저가

        @JsonProperty("dryy_lwpr_vrss_prpr_rate")
        private String dryyLwprVrssPrprRate; // 연중 최저가 대비 현재가 비율

        @JsonProperty("dryy_lwpr_date")
        private String dryyLwprDate;   // 연중 최저가 일자

        @JsonProperty("w52_hgpr")
        private String w52Hgpr;       // 52주일 최고가

        @JsonProperty("w52_hgpr_vrss_prpr_ctrt")
        private String w52HgprVrssPrprCtrt; // 52주일 최고가 대비 현재가 대비

        @JsonProperty("w52_hgpr_date")
        private String w52HgprDate;   // 52주일 최고가 일자

        @JsonProperty("w52_lwpr")
        private String w52Lwpr;       // 52주일 최저가

        @JsonProperty("w52_lwpr_vrss_prpr_ctrt")
        private String w52LwprVrssPrprCtrt; // 52주일 최저가 대비 현재가 대비

        @JsonProperty("w52_lwpr_date")
        private String w52LwprDate;   // 52주일 최저가 일자

        @JsonProperty("whol_loan_rmnd_rate")
        private String wholLoanRmndRate; // 전체 융자 잔고 비율

        @JsonProperty("ssts_yn")
        private String sstsYn;        // 공매도가능여부

        @JsonProperty("stck_shrn_iscd")
        private String stckShrnIscd;   // 주식 단축 종목코드

        @JsonProperty("fcam_cnnm")
        private String fcamCnnm;      // 액면가 통화명

        @JsonProperty("cpfn_cnnm")
        private String cpfnCnnm;      // 자본금 통화명

        @JsonProperty("apprch_rate")
        private String apprchRate;    // 접근도

        @JsonProperty("frgn_hldn_qty")
        private String frgnHldnQty;   // 외국인 보유 수량

        @JsonProperty("vi_cls_code")
        private String viClsCode;     // VI적용구분코드

        @JsonProperty("ovtm_vi_cls_code")
        private String ovtmViClsCode; // 시간외단일가VI적용구분코드

        @JsonProperty("last_ssts_cntg_qty")
        private String lastSstsCntgQty; // 최종 공매도 체결 수량

        @JsonProperty("invt_caful_yn")
        private String invtCafulYn;   // 투자유의여부

        @JsonProperty("mrkt_warn_cls_code")
        private String mrktWarnClsCode; // 시장경고코드

        @JsonProperty("short_over_yn")
        private String shortOverYn;   // 단기과열여부

        @JsonProperty("sltr_yn")
        private String sltrYn;       // 정리매매여부
    }
}
