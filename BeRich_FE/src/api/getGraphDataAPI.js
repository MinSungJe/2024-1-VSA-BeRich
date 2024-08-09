import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';
import { Alert } from 'react-native';

export const getGraphDataAPI = async (stockCode, graphType) => {
    try {
        const response = await tokenAPI.get(`${API_URL}/api/${stockCode}/graph-${graphType}`);
        if (response.data) {
            const data = response.data
            // console.log(data)
            return data
        }
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('Error', '그래프정보 불러올 때 에러났음');
        return null
    }
};