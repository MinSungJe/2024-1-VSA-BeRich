import React, { useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';
import { Text } from '@rneui/base';
import { useFocusEffect } from '@react-navigation/native';
import { TextStyles } from '../../styles/Text.style';
import { Color } from '../../resource/Color';
import { BoxStyles } from '../../styles/Box.style';

export default function StockInfoScreen() {
    // 초기값 선언
    const animationDuration = 500;

    const fadeAnimImage = useRef(new Animated.Value(0)).current;
    const translateYAnimImage = useRef(new Animated.Value(30)).current;

    const fadeAnimText1 = useRef(new Animated.Value(0)).current;
    const translateYAnimText1 = useRef(new Animated.Value(30)).current;

    const fadeAnimText2 = useRef(new Animated.Value(0)).current;
    const translateYAnimText2 = useRef(new Animated.Value(30)).current;

    const fadeAnimText3 = useRef(new Animated.Value(0)).current;
    const translateYAnimText3 = useRef(new Animated.Value(30)).current;

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

            const text3Animation = Animated.parallel([
                Animated.timing(fadeAnimText3, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnimText3, {
                    toValue: 0,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
            ]);

            Animated.sequence([
                imageAnimation,
                text1Animation,
                text2Animation,
                text3Animation,
            ]).start();
        }, [fadeAnimImage, translateYAnimImage, fadeAnimText1, translateYAnimText1, fadeAnimText2, translateYAnimText2, fadeAnimText3, translateYAnimText3])
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.MainColor }}>
            <Animated.Image 
                source={require('../../assets/image/icon-dummy.png')}
                style={[
                    BoxStyles.Mb30, 
                    { width: 150, height: 150, opacity: fadeAnimImage, transform: [{ translateY: translateYAnimImage }] }
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
                보고싶은 주식 종목을 선택하면
            </Animated.Text>
            <Animated.Text 
                style={[
                    TextStyles.Medium, 
                    TextStyles.FcWhite, 
                    TextStyles.FwBold, 
                    BoxStyles.Mb10,
                    { opacity: fadeAnimText2, transform: [{ translateY: translateYAnimText2 }] }
                ]}
            >
                원하는 주식의 정보를 볼 수 있습니다.
            </Animated.Text>
            <Animated.Text 
                style={[
                    TextStyles.Detail, 
                    TextStyles.FcWhite,
                    { opacity: fadeAnimText3, transform: [{ translateY: translateYAnimText3 }] }
                ]}
            >
                (주식 그래프, AI 활용 요약 뉴스)
            </Animated.Text>
        </View>
    );
}
