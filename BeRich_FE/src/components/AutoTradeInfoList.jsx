import { useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BoxStyles } from "../styles/Box.style";
import { TextStyles } from "../styles/Text.style";
import { getTradeInfoAPI } from "../api/getTradeInfoAPI";
import { AppContext } from "../contexts/AppContext";
import { Button } from "@rneui/base";

export default function AutoTradeInfoList() {
    const { state, setState } = useContext(AppContext);
    const [tradeInfo, setTradeInfo] = useState([])
    const [filteredInfo, setFilteredInfo] = useState([])

    useFocusEffect(
        React.useCallback(() => {
            // API 불러오기
            async function getTradeInfoData() {
                const tradeInfoData = await getTradeInfoAPI();
                setTradeInfo(tradeInfoData)
            }
            getTradeInfoData();
        }, [])
    );

    useEffect(() => {
        setFilteredInfo(tradeInfo.filter((e) => e.stockCode == JSON.parse(state.selectedStock).stockCode))
    }, [state])

    return (
        <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 300 }}>
            <View>
                {
                    (filteredInfo.length !== 0) ?
                        filteredInfo.map((a, i) => {
                            return (
                                <AutoTradeElement key={i} data={a} />
                            )
                        }) :
                        <Text style={[TextStyles.FcDarkGray, TextStyles.Detail]}>거래 내역이 없습니다.</Text>
                }
            </View>
        </ScrollView>
    );
}

function AutoTradeElement({ data }) {
    return (
        <Button buttonStyle={[BoxStyles.P10, BoxStyles.MainBox, BoxStyles.MT10, {flexDirection:'row', alignItems: "center", justifyContent:'space-between'}]}>
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
                    <Text style={[TextStyles.Detail]}>{data.investmentInsight}</Text>
                </View>
                <View style={[{ flexDirection: 'row' }, BoxStyles.Mb10]}>
                    <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.MR10]}>수익률</Text>
                    <Text style={[TextStyles.Detail]}>{data.totalProfit}</Text>
                </View>
            </View>
            <View>
                <Text style={[TextStyles.FcBlack, TextStyles.FwBold, TextStyles.Main]}>{'>'}</Text>
            </View>
        </Button>
    )
}