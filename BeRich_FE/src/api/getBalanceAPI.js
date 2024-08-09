import { Alert } from 'react-native';
import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';

export const getBalanceAPI = async () => {
    try {
        const response = await tokenAPI.get(`${API_URL}/api/balance`)
        if (response.data) {
            console.log('getBalanceAPI.js -')
            console.log(response.data)
            return response.data.dncaTotAmt
        }
    } catch (error) {
        if (error.response) {
            console.error("getBalance Error Response Data:", error.response.data);
            Alert.alert('주의', `등록된 계좌가 없습니다.`);
        } else {
            console.error("getBalance Error Message:", error.message);
            Alert.alert('Error', '계좌 잔액을 불러오는 과정 중 에러가 발생했습니다.');
        }
    }
}