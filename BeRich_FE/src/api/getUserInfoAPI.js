import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';

export const getUserInfoAPI = async () => {
    try {
        const response = await tokenAPI.get(`${API_URL}/api/user`);
        if (response.data) {
            // console.log(response.data)
            return response.data
        }
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('Error', '유저정보를 불러올 때 오류가 발생했습니다.');
    }
};