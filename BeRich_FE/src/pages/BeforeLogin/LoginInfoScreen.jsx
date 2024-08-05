import { Button, Text } from '@rneui/base';
import { Image, View } from 'react-native';
import { ButtonStyles } from '../../styles/Button.style';
import { BoxStyles } from '../../styles/Box.style';
import { TextStyles } from '../../styles/Text.style';
import { Color } from '../../resource/Color';

export default function LoginInfoScreen({ navigation }) {
    return (
        <View style={[BoxStyles.ContainerBox, BoxStyles.JCCenter, { backgroundColor: Color.MainColor }]}>
            <View style={[BoxStyles.AICenter]}>
                <Image source={require('../../assets/image/icon-dummy.png')}
                    style={[BoxStyles.Mb30, { width: 150, height: 150 }]} />
                <Text style={[TextStyles.Medium, TextStyles.FcWhite, TextStyles.FwBold]}>회원가입 후 우리 서비스를 이용해보세요.</Text>
            </View>
            <View style={[BoxStyles.P20]}>
                <Button onPress={() => { navigation.navigate('Register') }}
                    buttonStyle={[ButtonStyles.MainButton, ButtonStyles.BcWhite, BoxStyles.Mb10]} titleStyle={TextStyles.FcBlack}>회원가입 {'>'}</Button>
                <View style={[{ flexDirection: 'row' }, BoxStyles.JCCenter, BoxStyles.AICenter]}>
                    <Text style={[TextStyles.Detail, TextStyles.FcWhite, {paddingTop:5}]}>이미 계정이 있나요?</Text>
                    <Button onPress={() => { navigation.navigate('Login') }}
                        buttonStyle={ButtonStyles.InputButton} titleStyle={TextStyles.FcWhite}>로그인 {'>'}</Button>
                </View>
            </View>
        </View>
    );
}