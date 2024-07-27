import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Text } from "@rneui/base";
import { ScrollView, View } from "react-native";
import { StockPicker } from "../../components/StockPicker";
import { BoxStyles } from "../../styles/Box.style";
import { TextStyles } from "../../styles/Text.style";
import { CandleGraph } from '../../components/CandleGraph';
import { LineGraph } from '../../components/LineGraph';
import { useContext, useEffect, useState } from 'react';
import News from '../../components/News';
import { ButtonStyles } from '../../styles/Button.style';
import { AppContext } from '../../contexts/AppContext';

export default function StockScreen({ navigation }) {
    const [stock, setStock] = useState('');
    const { state, setState } = useContext(AppContext);

    useEffect(() => {
        setStock(state.selectedStock);
    }, [state.selectedStock]);

    return (
        <View style={BoxStyles.P10}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[BoxStyles.MainBox, BoxStyles.Mb20]}>
                    <View style={BoxStyles.MainBoxTitle}>
                        <Text style={[TextStyles.Detail, TextStyles.FcWhite]}>
                            <MaterialCommunityIcons name="cursor-default" size={16} /> 주식 선택
                        </Text>
                    </View>
                    <View style={BoxStyles.MainBoxContent}>
                        <StockPicker stock={stock} setStock={setStock} />
                    </View>
                </View>
                <View style={[BoxStyles.MainBox, BoxStyles.Mb20]}>
                    <View style={[BoxStyles.MainBoxTitle, BoxStyles.Mb30]}>
                        <Text style={[TextStyles.Detail, TextStyles.FcWhite]}>
                            <MaterialCommunityIcons name="chart-line" size={16} /> 주식 그래프
                        </Text>
                    </View>
                    <View style={BoxStyles.MainBoxContent}>
                        <CandleGraph stock={stock} />
                    </View>
                </View>
                <View style={[BoxStyles.MainBox]}>
                    <View style={BoxStyles.MainBoxTitle}>
                        <Text style={[TextStyles.Detail, TextStyles.FcWhite]}>
                            <MaterialCommunityIcons name="newspaper" size={16} /> AI 뉴스 요약
                        </Text>
                    </View>
                    <View style={BoxStyles.MainBoxContent}>
                        <News stock={stock} />
                    </View>
                </View>
                <View style={[{ flexDirection: 'row' }, BoxStyles.JCCenter]}>
                    <Button 
                        buttonStyle={ButtonStyles.InputButton} 
                        titleStyle={TextStyles.Detail} 
                        title={`${stock} 주식을 거래하시겠어요? >`}
                        onPress={() => {
                            setState((prevContext) => ({
                                ...prevContext,
                                selectedStock: stock,
                            }));
                            navigation.navigate('AutoTrade');
                        }} 
                    />
                </View>
            </ScrollView>
        </View>
    );
}
