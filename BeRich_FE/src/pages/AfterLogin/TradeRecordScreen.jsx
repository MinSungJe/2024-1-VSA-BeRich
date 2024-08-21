import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { getDetailTradeRecordAPI } from "../../api/getDetailTradeRecordAPI";
import { BoxStyles } from "../../styles/Box.style";
import { TextStyles } from "../../styles/Text.style";

export default function TradeRecordScreen({ route }) {
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

function TradeRecordElement({ data }) {
    return (
        <View style={[BoxStyles.Mb20]}>
            <View style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }]}>
                <Image
                    source={require('../../assets/image/icon-gpt.png')}
                    style={[{ width: 32, height: 32 }, BoxStyles.MR10]} />
                <Text style={[TextStyles.Detail, TextStyles.FwBold]}>{data.decisionTime.substring(0, 10)} {data.decisionTime.substring(11, 19)}</Text>
            </View>
            <View style={[BoxStyles.MainBox]}>
                <View style={[{ flexDirection: 'row', paddingBottom: 10 }, BoxStyles.MainBoxTitle]}>
                    {
                        (data.decision == 'hold') ?
                            <Text style={[TextStyles.Medium, TextStyles.FcWhite, TextStyles.FwBold]}><MaterialCommunityIcons name="chat-processing" size={24} style={[{ marginRight: 10 }]} />  Hold</Text>
                            :
                            (data.decision == 'buy') ?
                                <Text style={[TextStyles.Medium, TextStyles.FcWhite, TextStyles.FwBold]}><MaterialCommunityIcons name="chat-alert" size={24} style={[{ marginRight: 10 }]} />  Buy {data.percentage}%</Text>
                                :
                                <Text style={[TextStyles.Medium, TextStyles.FcWhite, TextStyles.FwBold]}><MaterialCommunityIcons name="chat-alert" size={24} style={[{ marginRight: 10 }]} />  Sell {data.percentage}%</Text>
                    }
                </View>
                <View style={[BoxStyles.MainBoxContent]}>
                    <MaterialCommunityIcons name="emoticon" size={20} style={[{ marginBottom: 5 }]} />
                    <View style={[{ flexDirection: 'row', marginBottom: 10, paddingBottom: 10 }, BoxStyles.BottomGrayLine]}>
                        <Text style={[TextStyles.Detail]}>{data.reason}</Text>
                    </View>
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 5 }]}>
                        <View>
                            <Text style={[TextStyles.Detail, TextStyles.FwBold]}>주문 금액</Text>
                            <Text style={[TextStyles.Detail]}>{data.tradeRecord.orderPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                        </View>
                        <View>
                            <Text style={[TextStyles.Detail, TextStyles.FwBold]}>주문 주식</Text>
                            <Text style={[TextStyles.Detail]}>{data.tradeRecord.orderStock.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                        </View>
                        <View>
                            <Text style={[TextStyles.Detail, TextStyles.FwBold]}>남은 주식</Text>
                            <Text style={[TextStyles.Detail]}>{data.tradeRecord.stockBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                        </View>
                    </View>

                    <View style={[{ flexDirection: 'row', justifyContent: 'space-evenly' }]}>
                        <View>
                            <Text style={[TextStyles.Detail, TextStyles.FwBold]}>계좌 잔액</Text>
                            <Text style={[TextStyles.Detail]}>{data.tradeRecord.cashBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                        </View>
                        <View>
                            <Text style={[TextStyles.Detail, TextStyles.FwBold]}>총 잔액</Text>
                            <Text style={[TextStyles.Detail]}>{data.tradeRecord.totalBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}