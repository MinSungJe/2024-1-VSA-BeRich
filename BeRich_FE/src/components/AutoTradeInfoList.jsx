import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BoxStyles } from "../styles/Box.style";
import { TextStyles } from "../styles/Text.style";
import { getTradeInfoAPI } from "../api/getTradeInfoAPI";
import { AppContext } from "../contexts/AppContext";
import { Button } from "@rneui/base";

export default function AutoTradeInfoList({ navigation }) {
    const { state, setState } = useContext(AppContext);
    const [tradeInfo, setTradeInfo] = useState([])
    const [filteredInfo, setFilteredInfo] = useState([])

    const setStatus = (data) => {
        setState((prevContext) => ({
            ...prevContext,
            statusData: data,
        }))
    }

    useEffect(() => {
        // API 불러오기
        async function getTradeInfoData() {
            const tradeInfoData = await getTradeInfoAPI();
            setTradeInfo(tradeInfoData)

            // 필터링
            let pending_end_data = tradeInfoData.filter((e) => e.status == 'PENDING_END')
            let active_data = tradeInfoData.filter((e) => e.status == 'ACTIVE')

            if (pending_end_data.length != 0) {
                setStatus(pending_end_data)
            }
            else if (active_data.length != 0) {
                setStatus(active_data)
            }
            else {
                setStatus([{ "endDay": "", "id": 0, "investmentInsight": "", "investmentPropensity": "", "startBalance": "", "startDay": "", "status": "ENDED", "stockCode": "", "totalProfit": "" }])
            }
            setFilteredInfo(tradeInfoData.filter((e) => e.stockCode == JSON.parse(state.selectedStock).stockCode))
        }
        getTradeInfoData();
    }, [state.selectedStock])

    return (
        <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 300 }}>
            <View>
                {
                    (filteredInfo.length !== 0) ?
                        filteredInfo.map((a, i) => {
                            return (
                                <AutoTradeElement key={i} navigation={navigation} data={a} />
                            )
                        }) :
                        <Text style={[TextStyles.FcDarkGray, TextStyles.Detail]}>거래 내역이 없습니다.</Text>
                }
            </View>
        </ScrollView>
    );
}

function AutoTradeElement({ navigation, data }) {
    return (
        <Button buttonStyle={[BoxStyles.P10, BoxStyles.MainBox, BoxStyles.BottomGrayLine, BoxStyles.MT10, { flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }]}
            onPress={() => { navigation.navigate('TradeRecord', { tradeId: data.id }) }}>
            <View>
                <View style={[{ flexDirection: 'row' }, BoxStyles.Mb10]}>
                    <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.MR10]}>기간</Text>
                    <Text style={[TextStyles.Detail]}>{data.startDay} ~ {data.endDay}</Text>
                </View>
                <View style={[{ flexDirection: 'row' }, BoxStyles.Mb10]}>
                    <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.MR10]}>경향</Text>
                    <Text style={[TextStyles.Detail]}>{data.investmentPropensity}</Text>
                </View>
                <View style={[{ flexDirection: 'row' }, BoxStyles.Mb10]}>
                    <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.MR10]}>의견</Text>
                    <Text style={[TextStyles.Detail]}>{(data.investmentInsight) ? (data.investmentInsight) : '(의견 없음)'}</Text>
                </View>
                <View style={[{ flexDirection: 'row' }, BoxStyles.Mb10]}>
                    <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.MR10]}>수익률</Text>
                    <Text style={[TextStyles.Detail]}>{data.totalProfit}</Text>
                </View>
                <View style={[{ flexDirection: 'row' }, BoxStyles.Mb10]}>
                    <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.MR10]}>상태</Text>
                    {
                        (data.status == 'ACTIVE') ?
                            <Text style={[TextStyles.Detail, TextStyles.FcRed, TextStyles.FwBold]}>현재 자동거래 중</Text>
                            :
                            (data.status == 'ENDED') ?
                                <Text style={[TextStyles.Detail]}>자동거래 종료</Text>
                                :
                                <Text style={[TextStyles.Detail]}>자동거래 종료대기</Text>
                    }
                </View>
            </View>
            <View>
                <Text style={[TextStyles.FcBlack, TextStyles.FwBold, TextStyles.Main]}>{'>'}</Text>
            </View>
        </Button>
    )
}