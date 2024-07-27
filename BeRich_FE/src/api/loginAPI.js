import axios from 'axios';
import { Alert } from 'react-native';
import { LOGIN_API_URL, REGISTER_API_URL } from '@env'

export const handleLogin = async (id, password) => {
    try {
        // console.log(id, password, LOGIN_API_URL)
        const response = await axios.post(LOGIN_API_URL, {
            id: id,
            password: password
        });
        if (response.data.success) {
            // 로그인 성공 시 처리
            Alert.alert('Login Successful', 'You have successfully logged in');
            // navigation.navigate('NextScreen');
        } else {
            Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred during login');
    }
};

export const handleRegister = async (id, password, email, fName, sName, date) => {
    try {
        console.log(id, password, email, fName, sName, date, REGISTER_API_URL)
        const response = await axios.post(REGISTER_API_URL, {
            id: id,
            password: password
        });
        if (response.data.success) {
            // 회원가입 성공 시 처리
            Alert.alert('Login Successful', 'You have successfully logged in');
            // navigation.navigate('NextScreen');
        } else {
            Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred during login');
    }
};