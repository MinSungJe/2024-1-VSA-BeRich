import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';
import { Alert } from 'react-native';

export const patchStopBotAPI = async (id, navigation) => {
    try {
        const response = await tokenAPI.patch(`${API_URL}/api/${id}/stop-bot`);
        if (response.data) {
            Alert.alert('거래 중지 요청 완료', response.data.message);
            navigation.replace('AutoTradeRefresh')
        }
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('Error', '거래 중지 요청 보낼 때 에러났음');
    }
};