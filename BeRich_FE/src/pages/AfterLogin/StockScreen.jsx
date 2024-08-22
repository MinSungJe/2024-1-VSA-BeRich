import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Text, ButtonGroup } from "@rneui/base";
import { ScrollView, View } from "react-native";
import { StockPicker } from "../../components/StockPicker";
import { BoxStyles } from "../../styles/Box.style";
import { TextStyles } from "../../styles/Text.style";
import { CandleGraph } from '../../components/CandleGraph';
import { LineGraph } from '../../components/LineGraph';
import { useContext, useState } from 'react';
import News from '../../components/News';
import { ButtonStyles } from '../../styles/Button.style';
import { AppContext } from '../../contexts/AppContext';
import { parseStockData } from '../../resource/ParseData';
import { Color } from '../../resource/Color';

export default function StockScreen({ navigation }) {
    const [stock, setStock] = useState(JSON.stringify({
        "stockCode": "000150",
        "companyName": "두산"
      }));
    const { state, setState } = useContext(AppContext);
    const stockData = parseStockData(stock); // stock Data 사용가능하도록 변환

    const [selectedGraph, setSelectedGraph] = useState('5d'); // 그래프 선택

    // 그래프 선택 옵션
    const graphLabels = ['5일', '3달'];
    const graphOptions = ['5d', '3mo'];
    const selectedIndex = graphOptions.indexOf(selectedGraph);

    return (
        <View style={BoxStyles.P10}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[BoxStyles.MainBox, BoxStyles.Mb20]}>
                    <View style={BoxStyles.MainBoxTitle}>
                        <Text style={[TextStyles.Detail, TextStyles.FcWhite, TextStyles.FwBold]}>
                            <MaterialCommunityIcons name="cursor-default" size={16} />  주식 선택
                        </Text>
                    </View>
                    <View style={BoxStyles.MainBoxContent}>
                        <StockPicker stock={stock} setStock={setStock} />
                    </View>
                </View>
                <View style={[BoxStyles.MainBox, BoxStyles.Mb20]}>
                    <View style={[BoxStyles.MainBoxTitle]}>
                        <Text style={[TextStyles.Detail, TextStyles.FcWhite, TextStyles.FwBold]}>
                            <MaterialCommunityIcons name="chart-line" size={16} />  주식 그래프
                        </Text>
                    </View>
                    <View style={[BoxStyles.MainBoxContent, BoxStyles.Mb20]}>
                        <ButtonGroup
                            buttons={graphLabels}
                            selectedIndex={selectedIndex}
                            onPress={(index) => setSelectedGraph(graphOptions[index])}
                            containerStyle={[BoxStyles.Mb30, {borderRadius: 10}]}
                            selectedButtonStyle={{ backgroundColor: Color.MainColor }}
                            buttonStyle={{backgroundColor: Color.White}}
                            textStyle={{ color: 'black' }}
                        />
                        <CandleGraph stock={stock} graphType={selectedGraph} />
                    </View>
                </View>
                <View style={[BoxStyles.MainBox]}>
                    <View style={BoxStyles.MainBoxTitle}>
                        <Text style={[TextStyles.Detail, TextStyles.FcWhite, TextStyles.FwBold]}>
                            <MaterialCommunityIcons name="newspaper" size={16} />  AI 뉴스 요약
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
                        title={`${stockData.companyName} 주식을 거래하시겠어요? >`}
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