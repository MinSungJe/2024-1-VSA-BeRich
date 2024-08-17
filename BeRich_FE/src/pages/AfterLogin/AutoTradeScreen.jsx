import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Text } from "@rneui/base";
import { useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";
import { AppContext } from "../../contexts/AppContext";
import { BoxStyles } from "../../styles/Box.style";
import { TextStyles } from "../../styles/Text.style";
import { StockPicker } from '../../components/StockPicker';
import { Input } from '@rneui/themed';
import { ButtonStyles } from '../../styles/Button.style';
import CheckBox from '@react-native-community/checkbox';
import { DateSpinnerTomorrow } from '../../components/Input';
import { dateFormat } from '../../resource/ParseData';
import { getStockBenefitAPI } from '../../api/getStockBenefitAPI';
import AutoTradeInfoList from '../../components/AutoTradeInfoList';

export default function AutoTradeScreen() {
    const { state, setState } = useContext(AppContext)
    const [benefit, setBenefit] = useState('')
    const [startDay, setStartDay] = useState(new Date())
    const [endDay, setEndDay] = useState(new Date())
    const [tendency, setTendency] = useState('')
    const [opinion, setOpinion] = useState('')
    const [toggleOpinion, setToggleOpinion] = useState(false)

    const setStock = (stock) => {
        setState((prevContext) => ({
            ...prevContext,
            selectedStock: stock,
        }))
    }

    const images = {
        '000150': require(`../../assets/image/company/icon-000150.png`),
        '005930': require(`../../assets/image/company/icon-005930.png`),
        '035720': require(`../../assets/image/company/icon-035720.png`),
        '300720': require(`../../assets/image/company/icon-300720.png`),
        '352820': require(`../../assets/image/company/icon-352820.png`)
    }

    // stockCode에 맞는 정보 호출
    useEffect(() => {
        if (JSON.parse(state.selectedStock).stockCode) {
            // API 불러오기
            async function getStockBenefitData(stockCode) {
                const benefitData = await getStockBenefitAPI(stockCode);
                setBenefit(benefitData.earningRate)
            }
            getStockBenefitData(JSON.parse(state.selectedStock).stockCode);
        }
    }, [state]);

    return (
        <View style={[BoxStyles.P10]}>
            <View style={[BoxStyles.MainBox, BoxStyles.Mb20]}>
                <View style={BoxStyles.MainBoxTitle}>
                    <Text style={[TextStyles.Detail, TextStyles.FcWhite]}>
                        <MaterialCommunityIcons name="hand-coin" size={16} /> 거래 주식 선택
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
                    <AutoTradeInfoList/>
                </View>
                <View style={[{ flex: 1 }]}>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.Mb20, BoxStyles.P10]}>
                <View style={[BoxStyles.P10]}>
                    <View style={[BoxStyles.Mb10, { flexDirection: 'row' }, BoxStyles.AICenter]}>
                        <Text style={[TextStyles.Detail, TextStyles.FwBold, { marginRight: 20 }]}>투자 종목</Text>
                        <Text style={[TextStyles.Detail]}>{JSON.parse(state.selectedStock).companyName} ({JSON.parse(state.selectedStock).stockCode})</Text>
                    </View>
                    <View style={[BoxStyles.Mb10, { flexDirection: 'row' }, BoxStyles.AICenter]}>
                        <Text style={[TextStyles.Detail, TextStyles.FwBold, { marginRight: 20 }]}>투자 기간</Text>
                        <View style={[{ flexDirection: 'row', justifyContent: 'center' }, BoxStyles.AICenter]}>
                            <Text style={[TextStyles.Detail, BoxStyles.MR10]}>{dateFormat(startDay)}</Text>
                            <Text style={[TextStyles.Detail, BoxStyles.MR10]}>~</Text>
                            <DateSpinnerTomorrow title={'투자 종료 기간 설정'} date={endDay} setDate={setEndDay} />
                        </View>
                    </View>
                    <View>
                        <Text style={[TextStyles.Detail, TextStyles.FwBold]}>투자 경향</Text>
                        <Input placeholder={'투자 경향을 마음대로 입력해보세요!'} value={tendency} onChangeText={setTendency} />
                    </View>
                    <View style={[BoxStyles.Mb10]}>
                        <View style={[{ flexDirection: 'row' }, BoxStyles.AICenter]}>
                            <Text style={[TextStyles.Detail, TextStyles.FwBold]}>개인 의견(선택사항)</Text>
                            <CheckBox
                                disabled={false}
                                value={toggleOpinion}
                                onValueChange={(newValue) => setToggleOpinion(newValue)}
                            />
                        </View>
                        {toggleOpinion ? <Input placeholder={'추가하려는 의견이 있나요?'} value={opinion} onChangeText={setOpinion} /> : null}
                    </View>
                    <Button buttonStyle={[ButtonStyles.MainButton]}>자동거래 시작</Button>
                </View>
            </View>
        </View>
    )
}