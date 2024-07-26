import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SwipeScreen from "./SwipeScreen";
import LoginScreen from "../pages/Login/LoginScreen";
import RegisterScreen from "../pages/Login/RegisterScreen";

const Stack = createNativeStackNavigator()

export default function StackScreen() {
    return(
        <Stack.Navigator initialRouteName="WelcomeInfo">
            <Stack.Screen name="WelcomeInfo" component={SwipeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{title: '로그인'}}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{title: '회원가입'}}/>
        </Stack.Navigator>
    )
}