import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getBalanceAPI = async () => {
    try {
        const accessToken = await AsyncStorage.getItem('user_access_token');
        const response = await axios.get(`${API_URL}/api/balance`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (response.data) {
            console.log(response.data)
            return response.data.dncaTotAmt
        }
    } catch (error) {
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
            Alert.alert('주의', `등록된 계좌가 없습니다!`);
        } else {
            console.error("Error Message:", error.message);
            Alert.alert('Error', '계좌 잔액을 불러오는 과정 중 에러가 발생했습니다.');
        }
    }
}