import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StockScreen from '../pages/AfterLogin/StockScreen';
import AutoTradeScreen from '../pages/AfterLogin/AutoTradeScreen';
import UserScreen from '../pages/AfterLogin/UserScreen';
import { Color } from '../resource/Color';

const Tab = createBottomTabNavigator();

export default function TabScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Stock"
      screenOptions={{
        tabBarActiveTintColor: Color.MainColor,
      }}>
      <Tab.Screen
        name="Stock"
        component={StockScreen}
        options={{
          title: '주식',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons  name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AutoTrade"
        component={AutoTradeScreen}
        options={{
          title: '매수/매도',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons  name="hand-coin" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          title: '회원정보',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}