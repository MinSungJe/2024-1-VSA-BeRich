import { API_URL } from '@env';
import { tokenAPI } from './tokenAPI';

export const getNewsAPI = async (stockCode) => {
    try {
        const response = await tokenAPI.get(`${API_URL}/api/${stockCode}/news`);
        if (response.data) {
            const data = response.data
            return data
        }
        return {"date": "2024-08-08", "summary": "여기에서 AI 뉴스를 제공합니다."}
    } catch (error) {
        // 요청 실패
        console.error("getNewsAPI "+error);
        return {"date": "2000-00-00", "summary": "뉴스 정보를 불러올 수 없습니다."}
    }
};