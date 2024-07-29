import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './src/pages/SplashScreen';
import TabScreen from './src/navigator/TabScreen';
import AuthScreen from './src/navigator/AuthScreen';
import { AppProvider } from './src/contexts/AppContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function AppContent() {
  const Stack = createNativeStackNavigator()

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
            <Stack.Screen name="AuthScreen" component={AuthScreen} options={{headerShown: false}}/>
            <Stack.Screen name="TabScreen" component={TabScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}