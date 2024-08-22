import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';
import { Alert } from 'react-native';

export const getStockBenefitAPI = async (stockCode) => {
    try {
        const response = await tokenAPI.get(`${API_URL}/api/profit/${stockCode}`);
        if (response.data) {
            const data = response.data
            // console.log(data)
            return data
        }
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('Error', '주식 이득 정보 불러올 때 에러났음');
        return null
    }
};