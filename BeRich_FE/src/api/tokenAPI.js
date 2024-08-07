import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getAccessToken } from "./authAPI";

// Axios 인스턴스 생성
export const tokenAPI = axios.create()

tokenAPI.interceptors.request.use(
    async (config) => {
        const accessTokenforAPI = await AsyncStorage.getItem('user_access_token');

        // AccessToken이 있다면 헤더에 토큰 추가
        if (accessTokenforAPI) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessTokenforAPI}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

tokenAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response) {
            const errorStatus = error.response.data.status
            const errorMessage = error.response.data.message

            switch (errorStatus) {
                case 403:
                    console.error('Access Token 만료, '+errorMessage)
                    await getAccessToken() // AccessToken 새로 불러오기
                    const newAccessToken = await AsyncStorage.getItem('user_access_token');
                    console.log('새로운 Access Token : '+ newAccessToken)

                    // header 설정 후 재실행
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return tokenAPI(originalRequest)
            }
        }
        return Promise.reject(error);
    }
)