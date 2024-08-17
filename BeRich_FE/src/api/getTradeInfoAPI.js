import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';
import { Alert } from 'react-native';

export const getTradeInfoAPI = async () => {
    try {
        const response = await tokenAPI.get(`${API_URL}/api/auto-trade-information`);
        if (response.data) {
            const data = response.data
            return data
        }
        return []
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('Error', '주식 거래내역 정보 불러올 때 에러났음');
        return null
    }
};