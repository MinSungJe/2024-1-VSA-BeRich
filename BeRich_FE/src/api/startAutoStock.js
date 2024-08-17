import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';
import { Alert } from 'react-native';

export const startAutoStock = async (stockCode, startDay, endDay, tendency, opinion) => {
    try {
        const response = await tokenAPI.post(`${API_URL}/api/auto-stock`, {
            stockCode: stockCode,
            startDay: startDay,
            endDay: endDay,
            investmentPropensity: tendency,
            investmentInsight: opinion
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data) {
            Alert.alert('자동거래 시작', response.data.message)
        } else {
            Alert.alert('자동거래 실패', '자동거래 요청 중 오류가 발생했습니다.')
        }
    } catch (error) {
        if (error.response) {
            console.error("startAutoStock Error Response Data:", error.response.data);
            Alert.alert('Error', `서버 오류: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
        } else {
            console.error("startAutoStock Error Message:", error.message);
            Alert.alert('Error', '자동 거래를 시작하는 과정 중 에러가 발생했습니다.');
        }
    }
};