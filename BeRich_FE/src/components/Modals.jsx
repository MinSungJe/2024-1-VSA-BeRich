import { Button, Text } from "@rneui/base";
import { useContext } from "react";
import { View, Modal } from "react-native";
import { AppContext } from "../contexts/AppContext";
import { BoxStyles } from "../styles/Box.style";
import { TextStyles } from "../styles/Text.style";
import { ButtonStyles } from "../styles/Button.style";
import { startAutoStock } from "../api/startAutoStock";
import { dateFormat } from "../resource/ParseData";

export function StartTradeModal({ modalVisible, setModalVisible, startDay, endDay, tendency, opinion, navigation }) {
    const { state, setState } = useContext(AppContext);

    return (
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
                                    navigation.replace('Refresh')
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
    )
}