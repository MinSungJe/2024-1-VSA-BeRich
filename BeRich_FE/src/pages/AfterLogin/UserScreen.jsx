import { Button, Text } from "@rneui/base";
import { View } from "react-native";
import { ButtonStyles } from "../../styles/Button.style";
import { handleLogout, handleWithdraw } from "../../api/authAPI";
import { TextStyles } from "../../styles/Text.style";
import { BoxStyles } from "../../styles/Box.style";
import { Color } from "../../resource/Color";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function UserScreen({ navigation }) {
    return (
        <View style={[BoxStyles.P10]}>
            <View style={[BoxStyles.MainBox, BoxStyles.PH10, BoxStyles.Mb20]}>
                <View style={[{ flexDirection: 'row' }, BoxStyles.BottomGrayLine, BoxStyles.P10, BoxStyles.JCCenter, BoxStyles.AICenter]}>
                    <View style={[BoxStyles.Flex1]}>
                        <Text style={[TextStyles.Detail, TextStyles.FcBlack]}>
                            <MaterialCommunityIcons name="account-circle" size={110} />
                        </Text>
                    </View>
                    <View style={[{ flex: 2 }, BoxStyles.PH10]}>
                        <Text style={[TextStyles.Medium, TextStyles.FcBlack]}>환영합니다.</Text>
                        <Text style={[TextStyles.Title, TextStyles.FcBlack]}>홍 길동 <Text style={[TextStyles.Medium]}>님</Text></Text>
                    </View>
                </View>
                <View style={[BoxStyles.P10]}>
                    <Text style={[TextStyles.Detail]}>현재 연결된 계좌</Text>
                    <Text style={[TextStyles.Main]}>₩ 200,000</Text>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.PH10, BoxStyles.Mb20]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.PV10]}>
                    <Button buttonStyle={[ButtonStyles.InputButton, { justifyContent: 'flex-start' }]} titleStyle={[TextStyles.Detail]}>
                        계좌 정보 관리</Button>
                </View>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.PV10]}>
                    <Button buttonStyle={[ButtonStyles.InputButton, { justifyContent: 'flex-start' }]} titleStyle={[TextStyles.Detail]} onPress={() => {
                        handleLogout(navigation)
                    }}>로그아웃</Button>
                </View>
                <View style={[BoxStyles.PV10]}>
                    <Button buttonStyle={[ButtonStyles.InputButton, { justifyContent: 'flex-start' }]} titleStyle={[TextStyles.Detail, TextStyles.FcRed]} onPress={() => {
                        handleWithdraw(navigation)
                    }}>회원탈퇴</Button>
                </View>
            </View>
        </View>
    )
}