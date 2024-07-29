import { Button, Text } from "@rneui/base";
import { View } from "react-native";
import { ButtonStyles } from "../../styles/Button.style";
import { handleLogout, handleWithdraw } from "../../api/authAPI";
import { TextStyles } from "../../styles/Text.style";

export default function UserScreen({navigation}) {
    return (
        <View>
            <Text>회원정보 페이지</Text>
            <Button buttonStyle={ButtonStyles.MainButton} onPress={()=>{
                handleLogout(navigation)
            }}>로그아웃</Button>
            <Button buttonStyle={ButtonStyles.InputButton} titleStyle={TextStyles.FcRed} onPress={()=>{
                handleWithdraw(navigation)
            }}>회원탈퇴</Button>
        </View>
    )
}