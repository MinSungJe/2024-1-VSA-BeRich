import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from '../resource/Color';
import { BoxStyles } from '../styles/Box.style';

export default function SplashScreen({ navigation }) {
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const value = await AsyncStorage.getItem('user_access_token');
                setAnimating(false); // 애니메이션 정지
                // await AsyncStorage.removeItem('user_access_token')
                console.log('AsyncStorage value:', value);
                navigation.replace(value === null ? 'AuthScreen' : 'TabScreen');
            } catch (error) {
                console.error('Error fetching the access token: ', error);
            }
        };

        const timer = setTimeout(() => {
            checkLogin();
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [navigation]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator
                animating={animating}
                color={Color.MainColor}
                size="large"
                style={[BoxStyles.JCCenter, BoxStyles.AICenter]}
            />
        </View>
    );
}
