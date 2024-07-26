import { Text } from '@rneui/base';
import { View } from 'react-native';
import { TextStyles } from '../../styles/Text.style';

export default function StockInfoScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={TextStyles.Main}>주식의 정보를 확인 가능합니다</Text>
        </View>
    );
}