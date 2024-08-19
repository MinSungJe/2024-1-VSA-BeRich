import { Button, Text } from "@rneui/base";
import { useContext } from "react";
import { Alert, View } from "react-native";
import { Input } from '@rneui/themed';
import CheckBox from '@react-native-community/checkbox';
import { AppContext } from "../contexts/AppContext";
import { BoxStyles } from "../styles/Box.style";
import { TextStyles } from "../styles/Text.style";
import { ButtonStyles } from "../styles/Button.style";
import { dateFormat } from "../resource/ParseData";
import { DateSpinnerTomorrow } from "./Input";
import { StopBotSelectBox } from "./SelectBox";


export function StartTradeComponent({ startDay, endDay, setEndDay, tendency, setTendency, toggleOpinion, setToggleOpinion, opinion, setOpinion, setModalVisible }) {
    const { state, setState } = useContext(AppContext);
    return (
        <View style={[BoxStyles.MainBox, BoxStyles.P10]}>
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
                        <DateSpinnerTomorrow title={'투자 종료 기간 설정'} date={endDay} setDate={setEndDay} startDay={startDay} />
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
                <Button buttonStyle={[ButtonStyles.MainButton]} onPress={() => {
                    if (!tendency) {
                        Alert.alert('오류', '자신의 투자경향을 입력해주세요!')
                        return;
                    }
                    setModalVisible(true);  // 모달창 열기
                }}>자동거래 시작</Button>
            </View>
        </View>
    )
}

export function StopTradeComponent({navigation}) {
    const { state, setState } = useContext(AppContext);
    return (
        <View style={[BoxStyles.MainBox, BoxStyles.P10]}>
            <View style={[BoxStyles.P10]}>
                <View style={[BoxStyles.Mb10, { flexDirection: 'row' }, BoxStyles.AICenter]}>
                    <Text style={[TextStyles.Detail, TextStyles.FwBold, { marginRight: 20 }]}>투자 종목 코드</Text>
                    <Text style={[TextStyles.Detail]}>{state.statusData[0].stockCode}</Text>
                </View>
                <View style={[BoxStyles.Mb10, { flexDirection: 'row' }, BoxStyles.AICenter]}>
                    <Text style={[TextStyles.Detail, TextStyles.FwBold, { marginRight: 20 }]}>투자 기간</Text>
                    <View style={[{ flexDirection: 'row', justifyContent: 'center' }, BoxStyles.AICenter]}>
                        <Text style={[TextStyles.Detail, BoxStyles.MR10]}>{state.statusData[0].startDay}</Text>
                        <Text style={[TextStyles.Detail, BoxStyles.MR10]}>~</Text>
                        <Text style={[TextStyles.Detail, BoxStyles.MR10]}>{state.statusData[0].endDay}</Text>
                    </View>
                </View>
                <View style={[BoxStyles.Mb10]}>
                    <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.Mb10]}>투자 경향</Text>
                    <Text style={[TextStyles.Detail, BoxStyles.MR10]}>{state.statusData[0].investmentPropensity}</Text>
                </View>
                <View style={[BoxStyles.Mb10]}>
                    <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.Mb10]}>개인 의견</Text>
                    <Text style={[TextStyles.Detail, BoxStyles.MR10]}>{state.statusData[0].investmentInsight ? state.statusData[0].investmentInsight : "(의견 없음)"}</Text>
                </View>
                {
                    (state.statusData[0].status == 'ACTIVE') ?
                        <Button buttonStyle={[ButtonStyles.MainButton]} onPress={() => {
                            StopBotSelectBox(state.statusData[0].id, navigation)
                        }}>자동거래 중지</Button> :
                        <Text style={[TextStyles.Detail, TextStyles.FwBold, { textAlign: "center" }]}>거래 중지 요청이 된 상태입니다.</Text>
                }
            </View>
        </View>
    )
}