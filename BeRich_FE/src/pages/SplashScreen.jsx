import React, { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from '../resource/Color';
import { BoxStyles } from '../styles/Box.style';
import { TextStyles } from '../styles/Text.style';

export default function SplashScreen({ navigation }) {
    const animationDuration = 1000

    // image의 fade와 위치 초기화
    const fadeAnimImage = useRef(new Animated.Value(0)).current;
    const translateYAnimImage = useRef(new Animated.Value(30)).current;

    // text의 fade와 위치 초기화
    const fadeAnimText = useRef(new Animated.Value(0)).current;
    const translateYAnimText = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnimImage, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnimImage, {
                    toValue: 0,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(fadeAnimText, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnimText, {
                    toValue: 0,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, [fadeAnimImage, translateYAnimImage, fadeAnimText, translateYAnimText]);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const value = await AsyncStorage.getItem('user_access_token');
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
            <Animated.Image source={require('../assets/image/icon-dummy.png')}
                style={[BoxStyles.Mb30, { width: 150, height: 150, opacity: fadeAnimImage, transform: [{ translateY: translateYAnimImage }] }]} />
            <Animated.Text style={[TextStyles.Medium, TextStyles.FcWhite, BoxStyles.Mb20,
            { opacity: fadeAnimText, transform: [{ translateY: translateYAnimText }] }]}>BeRich, AI와 함께하는 주식생활</Animated.Text>
        </View>
    );
}
