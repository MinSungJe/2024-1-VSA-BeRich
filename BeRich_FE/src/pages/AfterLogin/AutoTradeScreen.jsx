import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Text } from "@rneui/base";
import { useContext, useEffect, useState } from "react";
import { Alert, Image, View, Modal, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
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
import { startAutoStock } from '../../api/startAutoStock';

export default function AutoTradeScreen() {
    const { state, setState } = useContext(AppContext);
    const [benefit, setBenefit] = useState('');
    const [startDay, setStartDay] = useState(new Date());
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

    const setStock = (stock) => {
        setState((prevContext) => ({
            ...prevContext,
            selectedStock: stock,
        }));
    };

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
        } 0
    }, [state]);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[BoxStyles.P10]}>
                    {/* 모달 창 */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={[{ flex: 1, justifyContent: 'flex-end' }, BoxStyles.P10]}>
                                <View style={[BoxStyles.MainBox, BoxStyles.P10]}>
                                    <View style={[BoxStyles.PV10]}>
                                        <Text style={[TextStyles.Medium, TextStyles.FwBold, BoxStyles.Mb10, BoxStyles.BottomGrayLine, { paddingBottom: 10 }]}>투자 정보 확인</Text>
                                        <View style={[{ flexDirection: 'row' }, BoxStyles.Mb10]}>
                                            <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.MR10]}>종목</Text>
                                            <Text style={[TextStyles.Detail]}>{JSON.parse(state.selectedStock).companyName}</Text>
                                        </View>
                                        <View style={[{ flexDirection: 'row' }, BoxStyles.Mb10]}>
                                            <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.MR10]}>기간</Text>
                                            <Text style={[TextStyles.Detail]}>{dateFormat(startDay)} ~ {dateFormat(endDay)}</Text>
                                        </View>
                                        <View style={[{ flexDirection: 'row' }, BoxStyles.Mb10]}>
                                            <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.MR10]}>경향</Text>
                                            <Text style={[TextStyles.Detail]}>{tendency}</Text>
                                        </View>
                                        <View style={[{ flexDirection: 'row' }, BoxStyles.Mb20]}>
                                            <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.MR10]}>의견</Text>
                                            <Text style={[TextStyles.Detail]}>{opinion ? opinion : '(내용 없음)'}</Text>
                                        </View>
                                        <Text style={[TextStyles.Detail, TextStyles.FwBold, BoxStyles.Mb10]}>위 내용으로 자동거래를 시작할까요?</Text>
                                        <Button
                                            buttonStyle={[ButtonStyles.MainButton]}
                                            onPress={() => {
                                                startAutoStock(JSON.parse(state.selectedStock).stockCode, dateFormat(startDay), dateFormat(endDay), tendency, opinion)
                                                setModalVisible(false)
                                            }}>
                                            확인
                                        </Button>
                                        <Button
                                            buttonStyle={[ButtonStyles.InputButton]}
                                            titleStyle={[TextStyles.FcBlack]}
                                            onPress={() => setModalVisible(false)}>
                                            취소
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* 기존 화면 */}
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
                            <AutoTradeInfoList />
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
                            <Button buttonStyle={[ButtonStyles.MainButton]} onPress={() => {
                                if (!tendency) {
                                    Alert.alert('오류', '자신의 투자경향을 입력해주세요!')
                                    return;
                                }
                                setModalVisible(true);  // 모달창 열기
                            }}>자동거래 시작</Button>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}