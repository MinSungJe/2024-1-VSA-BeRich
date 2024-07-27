import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '@env'

export const handleLogin = async (id, password) => {
    try {
        // console.log(id, password)
        const response = await axios.post(`${API_URL}/login`, {
            loginId: id,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data.success) {
            // 로그인 성공 시 처리
            Alert.alert('로그인 성공', '로그인이 정상적으로 완료되었습니다.');
            // navigation.navigate('NextScreen');
        } else {
            Alert.alert('로그인 실패', response.data.message || '잘못된 정보입니다.');
        }
    } catch (error) {
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
            Alert.alert('Error', `서버 오류: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
        } else {
            console.error("Error Message:", error.message);
            Alert.alert('Error', '로그인 과정 중 에러가 발생했습니다.');
        }
    }
};

export const handleRegister = async (id, password, email, fName, sName, date) => {
    // console.log(typeof(id), typeof(password), typeof(email), typeof(fName), typeof(sName), typeof(date))
    try {
        const response = await axios.post(`${API_URL}/signup`, {
            loginId: id,
            email: email,
            password: password,
            firstName: fName,
            lastName: sName,
            birthDate: date
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data.success) {
            // 회원가입 성공 시 처리
            Alert.alert('회원가입 완료', '회원가입이 정상적으로 완료되었습니다.');
            // navigation.navigate('NextScreen');
        } else {
            Alert.alert('회원가입 실패', response.data.message || 'Invalid credentials');
        }
    } catch (error) {
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
            Alert.alert('Error', `서버 오류: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
        } else {
            console.error("Error Message:", error.message);
            Alert.alert('Error', '회원가입 과정 중 에러가 발생했습니다.');
        }
    }
};