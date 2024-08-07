import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenAPI } from './tokenAPI';

export const CheckAddAccount = (accountNum, appKey, appSecret) => {
    if (!accountNum || accountNum.length < 6) {
        Alert.alert('계좌 정보 변경 실패', '6자 이상 길이의 계좌 번호를 입력해주세요.')
        return false
    }
    if (!appKey) {
        Alert.alert('계좌 정보 변경 실패', 'App-Key를 입력해주세요.')
        return false
    }
    if (!appSecret) {
        Alert.alert('계좌 정보 변경 실패', 'App-Secret을 입력해주세요.')
        return false
    }

    return true
}

export const addAccountAPI = async (accountNum, appKey, appSecret, navigation) => {
    try {
        const response = await tokenAPI.post(`${API_URL}/api/account`, {
            accountNum: accountNum,
            appKey: appKey,
            appSecret: appSecret
        });
        if (response.data) {
            // 변경 성공 시 처리
            Alert.alert('계좌 정보 변경 완료', '계좌 정보가 정상적으로 변경되었습니다.');
            // 이동         
            navigation.goBack()
        } else {
            Alert.alert('계좌 정보 변경 실패', response.data.message || '잘못된 정보입니다.');
        }
    } catch (error) {
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
            Alert.alert('Error', `서버 오류: ${error.response.data || '알 수 없는 오류가 발생했습니다.'}`);
        } else {
            console.error("Error Message:", error.message);
            Alert.alert('Error', '변경 과정 중 에러가 발생했습니다.');
        }
    }
}