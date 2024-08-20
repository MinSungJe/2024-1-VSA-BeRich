import React, { useRef } from 'react';
import { Animated, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TextStyles } from '../../styles/Text.style';
import { Color } from '../../resource/Color';
import { BoxStyles } from '../../styles/Box.style';

export default function AutoTradeInfoScreen() {
    // 초기값 선언
    const animationDuration = 500

    const fadeAnimImage = useRef(new Animated.Value(0)).current;
    const translateYAnimImage = useRef(new Animated.Value(30)).current;

    const fadeAnimText1 = useRef(new Animated.Value(0)).current;
    const translateYAnimText1 = useRef(new Animated.Value(30)).current;

    const fadeAnimText2 = useRef(new Animated.Value(0)).current;
    const translateYAnimText2 = useRef(new Animated.Value(30)).current;

    useFocusEffect(
        React.useCallback(() => {
            const imageAnimation = Animated.parallel([
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
            ]);

            const text1Animation = Animated.parallel([
                Animated.timing(fadeAnimText1, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnimText1, {
                    toValue: 0,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
            ]);

            const text2Animation = Animated.parallel([
                Animated.timing(fadeAnimText2, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnimText2, {
                    toValue: 0,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
            ]);

            Animated.sequence([
                imageAnimation,
                text1Animation,
                text2Animation,
            ]).start();
        }, [fadeAnimImage, translateYAnimImage, fadeAnimText1, translateYAnimText1, fadeAnimText2, translateYAnimText2])
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.Black }}>
            <Animated.Image 
                source={require('../../assets/image/screen/screen_autotrade.png')}
                style={[
                    BoxStyles.Mb30, 
                    { width: 240, height: 540, opacity: fadeAnimImage, transform: [{ translateY: translateYAnimImage }] }
                ]} 
            />
            <Animated.Text 
                style={[
                    TextStyles.Medium, 
                    TextStyles.FcWhite, 
                    TextStyles.FwBold, 
                    BoxStyles.Mb10,
                    { opacity: fadeAnimText1, transform: [{ translateY: translateYAnimText1 }] }
                ]}
            >
                선택한 주식 종목에 대해
            </Animated.Text>
            <Animated.Text 
                style={[
                    TextStyles.Medium, 
                    TextStyles.FcWhite, 
                    TextStyles.FwBold,
                    { opacity: fadeAnimText2, transform: [{ translateY: translateYAnimText2 }] }
                ]}
            >
                AI 기반 자동 거래 서비스를 제공합니다.
            </Animated.Text>
        </View>
    );
}
