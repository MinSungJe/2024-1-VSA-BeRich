import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';
import { Alert } from 'react-native';

export const getStockListAPI = async () => {
    try {
        const response = await tokenAPI.get(`${API_URL}/api/stock-list`);
        if (response.data) {
            return response.data // 데이터 반환
        }
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('Error', '주식 목록 데이터를 불러오는 과정에서 에러 발생');
        return null
    }
};