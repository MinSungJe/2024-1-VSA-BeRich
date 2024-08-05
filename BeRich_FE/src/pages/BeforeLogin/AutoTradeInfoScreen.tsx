import { Text } from '@rneui/base';
import { Image, View } from 'react-native';
import { TextStyles } from '../../styles/Text.style';
import { Color } from '../../resource/Color';
import { BoxStyles } from '../../styles/Box.style';

export default function AutoTradeInfoScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.MainColor }}>
            <Image source={require('../../assets/image/icon-dummy.png')}
                style={[BoxStyles.Mb30, { width: 150, height: 150 }]} />
            <Text style={[TextStyles.Medium, TextStyles.FcWhite, TextStyles.FwBold, BoxStyles.Mb10]}>선택한 주식 종목에 대해</Text>
            <Text style={[TextStyles.Medium, TextStyles.FcWhite, TextStyles.FwBold]}>AI 기반 자동 거래 서비스를 제공합니다.</Text>
        </View>
    );
}