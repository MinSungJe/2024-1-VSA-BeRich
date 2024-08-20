import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from "@rneui/base";
import React, { useContext, useEffect, useState } from "react";
import { Image, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { AppContext } from "../../contexts/AppContext";
import { BoxStyles } from "../../styles/Box.style";
import { TextStyles } from "../../styles/Text.style";
import { StockPicker } from '../../components/StockPicker';
import { calculateStartDay } from '../../resource/ParseData';
import { getStockBenefitAPI } from '../../api/getStockBenefitAPI';
import AutoTradeInfoList from '../../components/AutoTradeInfoList';
import { StartTradeComponent, StopTradeComponent } from '../../components/TradeComponents';
import { StartTradeModal } from '../../components/Modals';
import { getTradeInfoAPI } from '../../api/getTradeInfoAPI';
import { useFocusEffect } from '@react-navigation/native';
import { getUserInfoAPI } from '../../api/getUserInfoAPI';

export default function AutoTradeScreen({ navigation }) {
    const { state, setState } = useContext(AppContext);
    const [benefit, setBenefit] = useState('');
    const [startDay, setStartDay] = useState(calculateStartDay);
    const [endDay, setEndDay] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    });
    const [tendency, setTendency] = useState('');
    const [opinion, setOpinion] = useState('');
    const [toggleOpinion, setToggleOpinion] = useState(false);

    // 모달 상태 추가
    const [modalVisible, setModalVisible] = useState(false);

    // 주식 선택 반영
    const setStock = (stock) => {
        setState((prevContext) => ({
            ...prevContext,
            selectedStock: stock,
        }));
    };

    // 거래 상태 반영
    const setStatus = (data) => {
        setState((prevContext) => ({
            ...prevContext,
            statusData: data,
        }))
    }

    // 계좌 상태 반영
    const setIsAccount = (isAccount) => {
        setState((prevContext) => ({
            ...prevContext,
            isAccount: isAccount,
        }))
    }

    const images = {
        '000150': require(`../../assets/image/company/icon-000150.png`),
        '005930': require(`../../assets/image/company/icon-005930.png`),
        '035720': require(`../../assets/image/company/icon-035720.png`),
        '300720': require(`../../assets/image/company/icon-300720.png`),
        '352820': require(`../../assets/image/company/icon-352820.png`)
    };

    // stockCode에 맞는 정보 호출
    useEffect(() => {
        if (JSON.parse(state.selectedStock).stockCode) {
            // API 불러오기
            async function getStockBenefitData(stockCode) {
                const benefitData = await getStockBenefitAPI(stockCode);
                setBenefit(benefitData.earningRate);
            }
            getStockBenefitData(JSON.parse(state.selectedStock).stockCode);
        }
    }, [state]);

    useFocusEffect(React.useCallback(() => {
        // API 불러오기
        async function getTradeInfoData() {
            const tradeInfoData = await getTradeInfoAPI();
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
        }
        async function getBalanceData() {
            const userInfoData = await getUserInfoAPI()
            if (userInfoData.accountNum == "등록된 계좌 없음") {
                setIsAccount(false)
                return
            }
            setIsAccount(true)
        }
        getBalanceData();
        getTradeInfoData();
    }, []))

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[BoxStyles.P10]}>
                    {/* 모달 창 */}
                    <StartTradeModal modalVisible={modalVisible} setModalVisible={setModalVisible} startDay={startDay} endDay={endDay} tendency={tendency} opinion={opinion} navigation={navigation} />

                    {/* 기존 화면 */}
                    <View style={[BoxStyles.MainBox, BoxStyles.Mb20]}>
                        <View style={BoxStyles.MainBoxTitle}>
                            <Text style={[TextStyles.Detail, TextStyles.FcWhite, TextStyles.FwBold]}>
                                <MaterialCommunityIcons name="hand-coin" size={16} />  거래 주식 선택
                            </Text>
                        </View>
                        <View style={BoxStyles.MainBoxContent}>
                            <StockPicker stock={state.selectedStock} setStock={setStock} />
                        </View>
                    </View>
                    <View style={[BoxStyles.MainBox, BoxStyles.Mb20, BoxStyles.P10]}>
                        <View style={[BoxStyles.PV10, BoxStyles.BottomGrayLine]}>
                            <View style={[BoxStyles.PH10, { flexDirection: 'row' }, BoxStyles.AICenter]}>
                                <View style={[{ flexDirection: 'row' }, BoxStyles.AICenter, BoxStyles.MR10]}>
                                    <Image
                                        source={images[JSON.parse(state.selectedStock).stockCode] || require('../../assets/image/icon-dummy.png')}
                                        style={[{ width: 32, height: 32 }, BoxStyles.MR10]} />
                                    <Text style={[TextStyles.Medium, TextStyles.FwBold]}>{JSON.parse(state.selectedStock).companyName}</Text>
                                </View>
                                {
                                    (benefit >= 0) ?
                                        <Text style={[TextStyles.Medium, TextStyles.FwBold, TextStyles.FcRed]}>▲ {benefit}%</Text> :
                                        <Text style={[TextStyles.Medium, TextStyles.FwBold, TextStyles.FcBlue]}>▼ {benefit}%</Text>
                                }
                            </View>
                        </View>
                        <View style={[BoxStyles.P10]}>
                            <AutoTradeInfoList navigation={navigation} />
                        </View>
                        <View style={[{ flex: 1 }]}>
                        </View>
                    </View>
                    {
                        state.statusData[0].status == 'ENDED' ?
                            <StartTradeComponent startDay={startDay} endDay={endDay} setEndDay={setEndDay} tendency={tendency} setTendency={setTendency} toggleOpinion={toggleOpinion} setToggleOpinion={setToggleOpinion} opinion={opinion} setOpinion={setOpinion} setModalVisible={setModalVisible} navigation={navigation} />
                            :
                            <StopTradeComponent navigation={navigation}/>
                    }
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}