import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AutoTradeScreen from "../pages/AfterLogin/AutoTradeScreen";
import TradeRecordScreen from "../pages/AfterLogin/TradeRecordScreen";
import DescriptionScreen from "../pages/AfterLogin/DescriptionScreen";
import AutoTradeRefreshScreen from "../pages/AfterLogin/AutoTradeRefreshScreen";
import { Button } from '@rneui/base';
import { Color } from '../resource/Color';

const Stack = createNativeStackNavigator();

export default function TradeScreen() {
    return (
        <Stack.Navigator initialRouteName="AutoTrade">
            <Stack.Screen name="AutoTrade" component={AutoTradeScreen} options={{title: '자동거래'}}/>
            <Stack.Screen 
                name="TradeRecord" 
                component={TradeRecordScreen} 
                options={({ navigation }) => ({
                    title: '거래 내역 확인',
                    headerRight: () => (
                        <Button
                            onPress={() => navigation.navigate('description')}
                            buttonStyle={{ backgroundColor: 'transparent' }}
                            icon={
                                <MaterialCommunityIcons name="information" size={32} color={Color.Black} />
                            }
                        />
                    ),
                })}
            />
            <Stack.Screen name="description" component={DescriptionScreen} options={{title: '용어 설명'}}/>
            <Stack.Screen name="AutoTradeRefresh" component={AutoTradeRefreshScreen} options={{title: '새로고침'}}/>
        </Stack.Navigator>
    );
}
