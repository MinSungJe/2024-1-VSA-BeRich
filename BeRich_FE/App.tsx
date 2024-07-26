import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabScreen from './src/navigator/TabScreen';
import StackScreen from './src/navigator/StackScreen';
import { AppProvider } from './src/contexts/AppContext';
import { AppContext } from './src/contexts/AppContext';

function AppContent() {
  const { state, setState } = React.useContext(AppContext);

  return (
      <NavigationContainer>
        {state.isLogin ? <TabScreen /> : <StackScreen />}
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