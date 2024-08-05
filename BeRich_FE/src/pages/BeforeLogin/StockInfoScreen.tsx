import { Text } from '@rneui/base';
import { Image, View } from 'react-native';
import { TextStyles } from '../../styles/Text.style';
import { Color } from '../../resource/Color';
import { BoxStyles } from '../../styles/Box.style';

export default function StockInfoScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.MainColor }}>
            <Image source={require('../../assets/image/icon-dummy.png')}
                style={[BoxStyles.Mb30, { width: 150, height: 150 }]} />
            <Text style={[TextStyles.Medium, TextStyles.FcWhite, TextStyles.FwBold, BoxStyles.Mb10]}>보고싶은 주식 종목을 선택하면</Text>
            <Text style={[TextStyles.Medium, TextStyles.FcWhite, TextStyles.FwBold, BoxStyles.Mb10]}>원하는 주식의 정보를 볼 수 있습니다.</Text>
            <Text style={[TextStyles.Detail, TextStyles.FcWhite]}>(주식 그래프, AI 활용 요약 뉴스)</Text>
        </View>
    );
}