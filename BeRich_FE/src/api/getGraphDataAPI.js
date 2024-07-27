import axios from 'axios';
import { API_URL } from '@env';  // 환경 변수를 사용하는 경우

const getGraphData = async () => {
    try {
        const response = await axios.get(`${API_URL}/graph`);
        Alert.alert('데이터받음', JSON.stringify(response.data));
    } catch (error) {
        // 요청 실패
        console.error(error);
        Alert.alert('에러남', '불러올 때 에러났음');
    }
};