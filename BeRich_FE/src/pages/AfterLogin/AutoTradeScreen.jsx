import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from "@rneui/base";
import { useContext } from "react";
import { Image, View } from "react-native";
import { AppContext } from "../../contexts/AppContext";
import { BoxStyles } from "../../styles/Box.style";
import { TextStyles } from "../../styles/Text.style";
import { StockPicker } from '../../components/StockPicker';

export default function AutoTradeScreen() {
    const { state, setState } = useContext(AppContext)

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
                        <Text style={[TextStyles.Main]}>{JSON.parse(state.selectedStock).companyName}</Text>
                    </View>
                </View>
                <View style={[BoxStyles.PV10, { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }]}>
                    <Text style={[TextStyles.Detail]}>종목별 수익률</Text>
                    <Text style={[TextStyles.Main]}>+35%</Text>
                </View>
            </View>
        </View>
    )
}