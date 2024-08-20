import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AutoTradeScreen from "../pages/AfterLogin/AutoTradeScreen";
import TradeRecordScreen from "../pages/AfterLogin/TradeRecordScreen";
import AutoTradeRefreshScreen from "../pages/AfterLogin/AutoTradeRefreshScreen";

const Stack = createNativeStackNavigator()

export default function TradeScreen() {
    return (
        <Stack.Navigator initialRouteName="AutoTrade">
            <Stack.Screen name="AutoTrade" component={AutoTradeScreen} options={{title: '자동거래'}}/>
            <Stack.Screen name="TradeRecord" component={TradeRecordScreen} options={{title: '거래 내역 확인'}}/>
            <Stack.Screen name="AutoTradeRefresh" component={AutoTradeRefreshScreen} options={{title: '새로고침'}}/>
        </Stack.Navigator>
    )
}