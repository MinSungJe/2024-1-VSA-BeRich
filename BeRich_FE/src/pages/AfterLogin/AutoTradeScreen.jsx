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
                            source={require('../../assets/image/icon-dummy.png')}
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