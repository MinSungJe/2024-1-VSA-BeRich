import { Button, Text } from "@rneui/base";
import { View } from "react-native";
import { ButtonStyles } from "../../styles/Button.style";
import { TextStyles } from "../../styles/Text.style";
import { BoxStyles } from "../../styles/Box.style";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeleteAccountSelectBox, LogoutSelectBox, WithdrawSelectBox } from "../../components/SelectBox";
import React, { useState } from "react";
import { getBalanceAPI } from "../../api/getBalanceAPI";
import { useFocusEffect } from '@react-navigation/native';
import { getUserInfoAPI } from "../../api/getUserInfoAPI";

export default function UserInfoScreen({ navigation }) {
    const [userInfo, setUserInfo] = useState({ "accountNum": "정보 불러오는 중", "firstName": "", "lastName": "", "loginId": "" });
    const [balance, setBalance] = useState(' -');

    useFocusEffect(
        React.useCallback(() => {
            async function getBalanceData() {
                const userInfoData = await getUserInfoAPI()
                const balanceData = await getBalanceAPI();
                setUserInfo(userInfoData)
                setBalance(`₩ ${balanceData.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`); // 정규식 이용 콤마 넣음
            }
            getBalanceData();
        }, [])
    );

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
                        <Text style={[TextStyles.Medium, TextStyles.FcBlack, BoxStyles.Mb10]}>환영합니다.</Text>
                        <Text style={[TextStyles.Title, TextStyles.FcBlack]}>{userInfo.firstName}{userInfo.lastName}<Text style={[TextStyles.Medium]}>님</Text></Text>
                    </View>
                </View>
                <View style={[{ padding: 15 }]}>
                    <Text style={[TextStyles.Detail, BoxStyles.Mb10]}>현재 연결된 계좌</Text>
                    <Text style={[TextStyles.Detail, TextStyles.FcDarkGray, BoxStyles.Mb5]}>{`(${userInfo.accountNum})`}</Text>
                    <View style={[{ flexDirection: "row", justifyContent: "space-between" }, BoxStyles.AICenter]}>
                        <Text style={[TextStyles.Main]}>{balance}</Text>
                        {(balance !== ' -') ? <Button buttonStyle={[ButtonStyles.MainButton]} onPress={() => {
                            DeleteAccountSelectBox(setUserInfo, setBalance)
                        }}>계좌정보 삭제</Button> : null}
                    </View>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.PH10, BoxStyles.Mb20]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.PV10]}>
                    <Button disabled={(balance !== ' -')} buttonStyle={[ButtonStyles.InputButton, { justifyContent: 'flex-start' }]} titleStyle={[TextStyles.Detail]} onPress={() => {
                        navigation.navigate('AddAccount')
                    }}>
                        계좌정보 관리</Button>
                </View>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.PV10]}>
                    <Button buttonStyle={[ButtonStyles.InputButton, { justifyContent: 'flex-start' }]} titleStyle={[TextStyles.Detail]} onPress={() => {
                        LogoutSelectBox(navigation)
                    }}>로그아웃</Button>
                </View>
                <View style={[BoxStyles.PV10]}>
                    <Button buttonStyle={[ButtonStyles.InputButton, { justifyContent: 'flex-start' }]} titleStyle={[TextStyles.Detail, TextStyles.FcRed]} onPress={() => {
                        WithdrawSelectBox(navigation)
                    }}>회원탈퇴</Button>
                </View>
            </View>
        </View>
    )
}
