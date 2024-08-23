import { Alert } from "react-native"

export const CheckSignUp = (id, password, emailId, selectedDomain, fName, sName, date) => {
    if (!id || id.length < 6) {
        Alert.alert('회원가입 실패', '6자 이상 길이의 ID를 입력해주세요.')
        return false
    }
    if (!password || password.length < 6) {
        Alert.alert('회원가입 실패', '6자 이상 길이의 비밀번호를 입력해주세요.')
        return false
    }
    if (!emailId) {
        Alert.alert('회원가입 실패', '이메일 ID를 입력해주세요.')
        return false
    }
    if (!selectedDomain) {
        Alert.alert('회원가입 실패', '이메일 도메인을 선택해주세요.')
        return false
    }
    if (!fName) {
        Alert.alert('회원가입 실패', '성을 입력해주세요.')
        return false
    }
    if (!sName) {
        Alert.alert('회원가입 실패', '이름을 입력해주세요.')
        return false
    }
    if (!date) {
        Alert.alert('회원가입 실패', '생년월일을 입력해주세요.')
        return false
    }

    return true
}

export const CheckLogin = (id, password) => {
    if (!id || id.length < 6) {
        Alert.alert('로그인 실패', '6자 이상 길이의 ID를 입력해주세요.')
        return false
    }
    if (!password || password.length < 1) {
        Alert.alert('로그인 실패', '비밀번호를 입력해주세요.')
        return false
    }

    return true
}