import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleLogin = async (id, password, navigation) => {
    // console.log(id, password, `${API_URL}/login 주소요청`)
    try {
        const response = await axios.post(`${API_URL}/login`, {
            loginId: id,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data) {
            // 로그인 성공 시 처리
            Alert.alert('로그인 성공', '로그인이 정상적으로 완료되었습니다.');

            // 토큰 저장
            let access_token = response.data.accessToken
            let refresh_token = response.data.refreshToken
            // console.log(access_token, refresh_token)
            await AsyncStorage.setItem('user_access_token', access_token);
            await AsyncStorage.setItem('user_refresh_token', refresh_token);

            // 이동
            navigation.replace('SplashScreen')
        } else {
            Alert.alert('로그인 실패', response.data.message || 'ID, 비밀번호를 다시 확인해주세요.');
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

export const handleRegister = async (id, password, email, fName, sName, date, navigation) => {
    // console.log(typeof(id), typeof(password), typeof(email), typeof(fName), typeof(sName), typeof(date), `${API_URL}/signup 주소요청`)
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
        if (response.status == 200) {
            // 회원가입 성공 시 처리
            Alert.alert('회원가입 완료', response.data.message);
            navigation.replace('Login');
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

export const CheckDuplicate = async (id, email) => {
    try {
        // ID 중복 확인
        const idResponse = await axios.post(`${API_URL}/signup/check-loginid`, {
            loginId: id
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        // if (idResponse.status == 200) console.log(idResponse.data.message)

        // 이메일 중복 확인
        const emailResponse = await axios.post(`${API_URL}/signup/check-email`, {
            email: email
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        // if (emailResponse.status == 200) console.log(emailResponse.data.message)
        
        return true // 중복 체크 통과
    } catch (error) {
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
            Alert.alert('회원가입 실패', `${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
        } else {
            console.error("Error Message:", error.message);
            Alert.alert('Error', '회원가입 중복체크 과정 중 에러가 발생했습니다.');
        }
        return false
    }
}

export const handleLogout = async (navigation) => {
    try {
        // 로그아웃 성공 시 처리
        Alert.alert('로그아웃 성공', '로그아웃이 정상적으로 완료되었습니다.');

        // 토큰 삭제
        await AsyncStorage.removeItem('user_access_token');
        await AsyncStorage.removeItem('user_refresh_token');

        // 이동
        navigation.replace('SplashScreen')

    } catch (error) {
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
            Alert.alert('Error', `서버 오류: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
        } else {
            console.error("Error Message:", error.message);
            Alert.alert('Error', '로그아웃 과정 중 에러가 발생했습니다.');
        }
    }
};

export const handleWithdraw = async (navigation) => {
    try {
        const accessToken = await AsyncStorage.getItem('user_access_token');
        const response = await axios.delete(`${API_URL}/api/withdraw`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (response.data) {
            // 토큰 삭제
            await AsyncStorage.removeItem('user_access_token');
            await AsyncStorage.removeItem('user_refresh_token');

            // 회원탈퇴 성공 시 처리
            Alert.alert('회원탈퇴 완료', response.data.message);

            // 이동
            navigation.replace('SplashScreen')
        }
    } catch (error) {
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
            Alert.alert('Error', `서버 오류: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
        } else {
            console.error("Error Message:", error.message);
            Alert.alert('Error', '회원탈퇴 과정 중 에러가 발생했습니다.');
        }
    }
}