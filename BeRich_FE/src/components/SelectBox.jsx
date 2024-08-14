import { Alert } from "react-native";
import { handleLogout, handleWithdraw } from "../api/authAPI";
import { deleteAccountAPI } from "../api/deleteAccountAPI";

export const LogoutSelectBox = (navigation) => {
    Alert.alert(
        "로그아웃",
        "정말로 로그아웃하시겠습니까?",
        [
            { text: '취소', onPress: () => { }, style: 'cancel' },
            {
                text: '로그아웃',
                onPress: () => {
                    handleLogout(navigation);
                },
                style: 'destructive',
            },
        ],
        {
            cancelable: true,
        },
    );
};

export const WithdrawSelectBox = (navigation) => {
    Alert.alert(
        "회원탈퇴",
        "정말로 회원탈퇴하시겠습니까?",
        [
            { text: '취소', onPress: () => { }, style: 'cancel' },
            {
                text: '탈퇴',
                onPress: () => {
                    handleWithdraw(navigation);
                },
                style: 'destructive',
            },
        ],
        {
            cancelable: true,
        },
    );
};

export const DeleteAccountSelectBox = (setUserInfo, setBalance) => {
    Alert.alert(
        "계좌정보 삭제",
        "정말로 계좌정보를 삭제하시겠습니까?",
        [
            { text: '취소', onPress: () => { }, style: 'cancel' },
            {
                text: '삭제',
                onPress: () => {
                    deleteAccountAPI(setUserInfo, setBalance);
                },
                style: 'destructive',
            },
        ],
        {
            cancelable: true,
        },
    );
};