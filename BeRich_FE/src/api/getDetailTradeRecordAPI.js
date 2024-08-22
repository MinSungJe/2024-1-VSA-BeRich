import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';
import { Alert } from 'react-native';

export const getDetailTradeRecordAPI = async (tradeID) => {
    try {
        const response = await tokenAPI.get(`${API_URL}/api/trade-record/${tradeID}`);
        if (response.data) {
            const data = response.data
            return data
        }
        return []
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('Error', 'ID당 거래 내역 정보 불러올 때 에러났음');
        return null
    }
};