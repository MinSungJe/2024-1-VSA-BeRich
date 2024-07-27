import axios from 'axios';
import { Alert } from 'react-native';
import { LOGIN_API_URL } from '@env'

export const handleLogin = async (id, password) => {
    try {
        console.log(id, password, LOGIN_API_URL)
        const response = await axios.post(LOGIN_API_URL, {
            id: id,
            password: password
        });
        if (response.data.success) {
            // 로그인 성공 시 다음 화면으로 이동하거나 다른 처리를 합니다.
            Alert.alert('Login Successful', 'You have successfully logged in');
            navigation.navigate('NextScreen'); // 'NextScreen'을 실제 화면 이름으로 교체하세요.
        } else {
            Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred during login');
    }
};