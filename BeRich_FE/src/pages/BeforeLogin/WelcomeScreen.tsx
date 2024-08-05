import { Text } from '@rneui/base';
import { Image, View } from 'react-native';
import { TextStyles } from '../../styles/Text.style';
import { Color } from '../../resource/Color';
import { BoxStyles } from '../../styles/Box.style';

export default function WelcomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.MainColor }}>
            <Image source={require('../../assets/image/icon-dummy.png')}
                style={[BoxStyles.Mb30, { width: 150, height: 150 }]} />
            <Text style={[TextStyles.Main, TextStyles.FwBold, TextStyles.FcWhite]}>어서오세요, BeRich입니다.</Text>
        </View>
    );
}