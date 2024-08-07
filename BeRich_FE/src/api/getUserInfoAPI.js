import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';

export const getUserInfoAPI = async () => {
    try {
        const response = await tokenAPI.get(`${API_URL}/api/user`);
        const data = response.data
        console.log(data)
        return data
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('Error', '유저정보를 불러올 때 오류가 발생했습니다.');

        const tempData = {
            "loginId": "string",
            "firstName": "string",
            "lastName": "string",
            "accountNum": "등록된 계좌 없음"
        }
        return tempData
    }
};