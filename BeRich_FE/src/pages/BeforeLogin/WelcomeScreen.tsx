import { Text } from '@rneui/base';
import { View } from 'react-native';
import { TextStyles } from '../../styles/Text.style';

export default function WelcomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={TextStyles.Main}>환영합니다!!!</Text>
        </View>
    );
}