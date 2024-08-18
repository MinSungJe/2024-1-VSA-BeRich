import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { getDetailTradeRecordAPI } from "../../api/getDetailTradeRecordAPI";
import { BoxStyles } from "../../styles/Box.style";
import { TextStyles } from "../../styles/Text.style";

export default function TradeRecordScreen({route}) {
    const [detailInfo, setDetailInfo] = useState([])
    const { tradeId } = route.params;

    useFocusEffect(
        React.useCallback(() => {
            // API 불러오기
            async function getDetailTradeInfoData() {
                const tradeInfoData = await getDetailTradeRecordAPI(tradeId);
                setDetailInfo(tradeInfoData)
            }
            getDetailTradeInfoData();
        }, [])
    );

    return (
        <ScrollView style={[BoxStyles.P10]}>
            {
                detailInfo.map((a, i) => {
                    return (
                        <TradeRecordElement key={i} data={a} />
                    )
                })
            }
        </ScrollView>
    )
}

function TradeRecordElement({data}) {
    return (
        <View>
            <Text style={[TextStyles.Detail, TextStyles.FwBold]}>{data.decisionTime.substring(0, 10)} {data.decisionTime.substring(11,19)}</Text>
            <View style={[BoxStyles.MainBox, BoxStyles.P10]}>
                <Text style={[TextStyles.Detail]}>{data.decision}</Text>
                <Text style={[TextStyles.Detail]}>{data.reason}</Text>
            </View>
        </View>
    )
}