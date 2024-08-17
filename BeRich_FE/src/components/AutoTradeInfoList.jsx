import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { BoxStyles } from "../styles/Box.style";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextStyles } from "../styles/Text.style";
import { getTradeInfoAPI } from "../api/getTradeInfoAPI";

export default function AutoTradeInfoList() {
    const [tradeInfo, setTradeInfo] = useState([])

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

    return (
        <View style={[{ flexDirection: 'row' }, BoxStyles.AICenter]}>
            <MaterialCommunityIcons name="view-list-outline" size={32} style={[BoxStyles.MR10]} />
            <Text style={[TextStyles.Medium]}>거래 내역</Text>
            {
                tradeInfo.map((a, i) => {
                    return (
                        <Text key={i} style={[TextStyles.Medium]}>{a.id}</Text>
                    )
                })
            }
        </View>
    )
}