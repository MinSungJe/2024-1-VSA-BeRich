import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AutoTradeScreen from "../pages/AfterLogin/AutoTradeScreen";
import TradeRecordScreen from "../pages/AfterLogin/TradeRecordScreen";

const Stack = createNativeStackNavigator()

export default function TradeScreen() {
    return (
        <Stack.Navigator initialRouteName="AutoTrade">
            <Stack.Screen name="AutoTrade" component={AutoTradeScreen} options={{title: '매수/매도'}}/>
            <Stack.Screen name="TradeRecord" component={TradeRecordScreen} options={{title: '거래 내역 확인'}}/>
        </Stack.Navigator>
    )
}