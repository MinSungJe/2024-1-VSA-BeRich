import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserInfoScreen from "../pages/AfterLogin/UserInfoScreen";
import AddAccountScreen from "../pages/AfterLogin/AddAccountScreen";
import UserInfoRefreshScreen from "../pages/AfterLogin/UserInfoRefreshScreen";

const Stack = createNativeStackNavigator()

export default function UserScreen() {
    return (
        <Stack.Navigator initialRouteName="UserInfo">
            <Stack.Screen name="UserInfo" component={UserInfoScreen} options={{title: '회원정보'}}/>
            <Stack.Screen name="AddAccount" component={AddAccountScreen} options={{title: '계좌 정보 관리'}}/>
            <Stack.Screen name="UserInfoRefresh" component={UserInfoRefreshScreen} options={{title: '새로고침'}}/>
        </Stack.Navigator>
    )
}