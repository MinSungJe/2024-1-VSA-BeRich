import { Button, Text } from "@rneui/base";
import { View } from "react-native";
import { ButtonStyles } from "../../styles/Button.style";
import { handleLogout } from "../../api/authAPI";

export default function UserScreen({navigation}) {
    return (
        <View>
            <Text>회원정보 페이지</Text>
            <Button buttonStyle={ButtonStyles.MainButton} onPress={()=>{
                handleLogout(navigation)
            }}>로그아웃</Button>
        </View>
    )
}