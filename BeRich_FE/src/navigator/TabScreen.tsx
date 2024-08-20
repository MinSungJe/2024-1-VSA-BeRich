import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StockScreen from '../pages/AfterLogin/StockScreen';
import { Color } from '../resource/Color';
import UserScreen from './UserScreen';
import TradeScreen from './TradeScreen';

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
        name="Trade"
        component={TradeScreen}
        options={{
          title: '자동거래',
          headerShown: false,
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
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}