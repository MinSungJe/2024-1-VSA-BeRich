import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { TextStyles } from '../../styles/Text.style';
import { Color } from '../../resource/Color';
import { BoxStyles } from '../../styles/Box.style';

export default function WelcomeScreen() {
    const animationDuration = 500

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

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.Black }}>
            <Animated.Image 
                source={require('../../assets/image/icon-app.png')}
                style={[
                    BoxStyles.Mb30, 
                    { width: 150, height: 150, opacity: fadeAnimImage, transform: [{ translateY: translateYAnimImage }] }
                ]} 
            />
            <Animated.Text 
                style={[
                    TextStyles.Main, 
                    TextStyles.FwBold, 
                    TextStyles.FcWhite, 
                    { opacity: fadeAnimText, transform: [{ translateY: translateYAnimText }] }
                ]}
            >
                어서오세요, 주피티입니다.
            </Animated.Text>
        </View>
    );
}
