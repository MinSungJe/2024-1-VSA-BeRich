import { Text } from '@rneui/base';
import { View } from 'react-native';
import { TextStyles } from '../../styles/Text.style';

export default function AutoTradeInfoScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={TextStyles.Main}>자동으로 거래도 된답니다.</Text>
        </View>
    );
}