import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Text } from "@rneui/base";
import { useContext, useState } from "react";
import { Image, View } from "react-native";
import { AppContext } from "../../contexts/AppContext";
import { BoxStyles } from "../../styles/Box.style";
import { TextStyles } from "../../styles/Text.style";
import { StockPicker } from '../../components/StockPicker';
import { Input } from '@rneui/themed';
import { ButtonStyles } from '../../styles/Button.style';
import CheckBox from '@react-native-community/checkbox';

export default function AutoTradeScreen() {
    const { state, setState } = useContext(AppContext)
    const [period, setPeriod] = useState(7)
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
                        <Image
                            source={images[JSON.parse(state.selectedStock).stockCode] || require('../../assets/image/icon-dummy.png')}
                            style={[{ width: 32, height: 32 }, BoxStyles.MR10]} />
                        <Text style={[TextStyles.Medium, TextStyles.FwBold]}>{JSON.parse(state.selectedStock).companyName}</Text>
                    </View>
                </View>
                <View style={[BoxStyles.P10, { flexDirection: 'row', alignItems: 'center' }, BoxStyles.BottomGrayLine]}>
                    <MaterialCommunityIcons name="creation" size={32} style={[BoxStyles.MR10]} />
                    <Text style={[TextStyles.Medium, { marginRight: 50 }]}>수익률</Text>
                    <Text style={[TextStyles.Main, TextStyles.FwBold]}>+35%</Text>
                </View>
                <View style={[BoxStyles.P10, { flexDirection: 'row' }, BoxStyles.AICenter]}>
                    <MaterialCommunityIcons name="view-list-outline" size={32} style={[BoxStyles.MR10]} />
                    <Text style={[TextStyles.Medium]}>거래 내역</Text>
                </View>
                <View style={[{ flex: 1 }]}>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.Mb20, BoxStyles.P10]}>
                <View style={[BoxStyles.P10]}>
                    <View style={[BoxStyles.Mb10, { flexDirection: 'row' }, BoxStyles.AICenter]}>
                        <Text style={[TextStyles.Detail, TextStyles.FwBold, { marginRight: 20 }]}>투자 종목</Text>
                        <Text style={[TextStyles.Detail]}>{JSON.parse(state.selectedStock).companyName}</Text>
                    </View>
                    <View style={[BoxStyles.Mb10, { flexDirection: 'row' }, BoxStyles.AICenter]}>
                        <Text style={[TextStyles.Detail, TextStyles.FwBold, { marginRight: 20 }]}>투자 기간</Text>
                        <View style={[{ flexDirection: 'row' }, BoxStyles.AICenter]}>
                            <Text style={[TextStyles.Medium, TextStyles.FwBold, BoxStyles.MR10]}>{period}일</Text>
                            <Button buttonStyle={[ButtonStyles.MainButton]}>변경</Button>
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