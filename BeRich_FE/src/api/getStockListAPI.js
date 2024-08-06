import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';

const getStockListAPI = async () => {
    try {
        const response = await tokenAPI.get(`${API_URL}/api/stock-list`);
        return JSON.stringify(response.data) // 데이터 반환
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('Error', '주식 목록 데이터를 불러오는 과정에서 에러 발생');
        return null
    }
};

// 주식 데이터
export const stockData = await getStockListAPI()