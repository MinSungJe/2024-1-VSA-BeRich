import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from '../resource/Color';
import { BoxStyles } from '../styles/Box.style';
import { useEffect, useState } from 'react';

export default function SplashScreen({ navigation }) {
    //State for ActivityIndicator animation
    const [animating, setAnimating] = useState(true);

    // 로그인 확인
    useEffect(() => {
        setTimeout(() => {
            setAnimating(false);
            AsyncStorage.getItem('user_token').then((value) => 
                navigation.replace(value === null ? 'AuthScreen' : 'TabScreen'),
            );
        }, 3000);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator
                animating={animating}
                color={Color.MainColor}
                size="large"
                style={[BoxStyles.JCCenter ,BoxStyles.AICenter]}
            />
        </View>
    );
}