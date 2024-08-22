import { Alert } from "react-native";
import { API_URL } from '@env'
import { tokenAPI } from "./tokenAPI";
import { getUserInfoAPI } from "./getUserInfoAPI";

export const deleteAccountAPI = async (setUserInfo, setBalance, navigation) => {
    try {
        const response = await tokenAPI.delete(`${API_URL}/api/account-delete`)
        if (response.data) {
            // 계좌삭제 성공
            Alert.alert('계좌정보 삭제완료', response.data.message);
            setBalance(' -')
            const userInfoData = await getUserInfoAPI()
            setUserInfo(userInfoData)
            navigation.replace('UserInfoRefresh')
        }
    } catch (error) {
        if (error.response) {
            console.error("deleteAccount Error Response Data:", error.response.data);
        } else {
            console.error("deleteAccount Error Message:", error.message);
            Alert.alert('Error', '계좌삭제 과정 중 에러가 발생했습니다.');
        }
    }
}