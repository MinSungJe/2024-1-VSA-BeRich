import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from '../resource/Color';
import { BoxStyles } from '../styles/Box.style';
import { TextStyles } from '../styles/Text.style';

export default function SplashScreen({ navigation }) {
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const value = await AsyncStorage.getItem('user_access_token');
                setAnimating(false); // 애니메이션 정지
                // console.log('AsyncStorage value:', value);
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.MainColor }}>
            <Image source={require('../assets/image/icon-dummy.png')}
                style={[BoxStyles.Mb30, { width: 150, height: 150 }]} />
            <Text style={[TextStyles.Medium, TextStyles.FcWhite, BoxStyles.Mb20]}>BeRich, AI와 함께하는 주식생활</Text>
            <ActivityIndicator
                animating={animating}
                color={Color.White}
                size="large"
                style={[BoxStyles.JCCenter, BoxStyles.AICenter]}
            />
        </View>
    );
}
