import React, { useRef } from 'react';
import { Animated, View } from 'react-native';
import { Button, Text } from '@rneui/base';
import { useFocusEffect } from '@react-navigation/native';
import { ButtonStyles } from '../../styles/Button.style';
import { BoxStyles } from '../../styles/Box.style';
import { TextStyles } from '../../styles/Text.style';
import { Color } from '../../resource/Color';

export default function LoginInfoScreen({ navigation }) {
    // 초기값 선언
    const animationDuration = 500

    const fadeAnimImage = useRef(new Animated.Value(0)).current;
    const translateYAnimImage = useRef(new Animated.Value(30)).current;

    const fadeAnimText1 = useRef(new Animated.Value(0)).current;
    const translateYAnimText1 = useRef(new Animated.Value(30)).current;

    const fadeAnimButton1 = useRef(new Animated.Value(0)).current;
    const translateYAnimButton1 = useRef(new Animated.Value(30)).current;

    const fadeAnimButton2 = useRef(new Animated.Value(0)).current;
    const translateYAnimButton2 = useRef(new Animated.Value(30)).current;

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

            const button1Animation = Animated.parallel([
                Animated.timing(fadeAnimButton1, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnimButton1, {
                    toValue: 0,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
            ]);

            const button2Animation = Animated.parallel([
                Animated.timing(fadeAnimButton2, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnimButton2, {
                    toValue: 0,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
            ]);

            Animated.sequence([
                imageAnimation,
                text1Animation,
                button1Animation,
                button2Animation,
            ]).start();
        }, [
            fadeAnimImage, translateYAnimImage,
            fadeAnimText1, translateYAnimText1,
            fadeAnimButton1, translateYAnimButton1,
            fadeAnimButton2, translateYAnimButton2
        ])
    );

    return (
        <View style={[BoxStyles.ContainerBox, BoxStyles.JCCenter, { backgroundColor: Color.MainColor }]}>
            <View style={[BoxStyles.AICenter]}>
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
                        { opacity: fadeAnimText1, transform: [{ translateY: translateYAnimText1 }] }
                    ]}
                >
                    회원가입 후 우리 서비스를 이용해보세요.
                </Animated.Text>
            </View>
            <View style={[BoxStyles.P20]}>
                <Animated.View style={{ opacity: fadeAnimButton1, transform: [{ translateY: translateYAnimButton1 }] }}>
                    <Button onPress={() => { navigation.navigate('Register') }}
                        buttonStyle={[ButtonStyles.MainButton, ButtonStyles.BcWhite, BoxStyles.Mb10]} titleStyle={TextStyles.FcBlack}>
                        회원가입 {'>'}
                    </Button>
                </Animated.View>
                <Animated.View style={[{ flexDirection: 'row', opacity: fadeAnimButton2, transform: [{ translateY: translateYAnimButton2 }] }, BoxStyles.JCCenter, BoxStyles.AICenter]}>
                    <Text
                        style={[
                            TextStyles.Detail,
                            TextStyles.FcWhite,
                            { paddingTop: 5 }
                        ]}
                    >
                        이미 계정이 있나요?
                    </Text>
                    <Button onPress={() => { navigation.navigate('Login') }}
                        buttonStyle={ButtonStyles.InputButton} titleStyle={TextStyles.FcWhite}>
                        로그인 {'>'}
                    </Button>
                </Animated.View>
            </View>
        </View>
    );
}
