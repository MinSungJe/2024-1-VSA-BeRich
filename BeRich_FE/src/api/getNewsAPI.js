import axios from 'axios';
import { API_URL } from '@env';

export const getNewsAPI = async ({stockCode}) => {
    try {
        const response = await axios.get(`${API_URL}/api/${stockCode}/news`);
        const data = response.data
        console.log(data)
        return data
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('Error', '뉴스정보 불러올 때 에러났음');
        return null
    }
};