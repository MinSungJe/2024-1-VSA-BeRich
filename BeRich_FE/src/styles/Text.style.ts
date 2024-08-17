import { StyleSheet } from "react-native";
import { Color } from "../resource/Color";

export const TextStyles = StyleSheet.create({
    FcWhite: {
        color: Color.White
    },

    FcRed: {
        color: Color.Red
    },
    FcBlue: {
        color: Color.Blue
    },
    FcBlack: {
        color: Color.MainColor
    },
    FcGray: {
        color: Color.Gray
    },
    FcDarkGray: {
        color: Color.DarkGray
    },
    FwBold: {
        fontFamily: 'NanumGothicBold',
    },

	Title: {
        fontFamily: 'NanumGothicBold',
        fontSize: 40,
        color: Color.MainColor,
    },

    Main: {
        fontFamily: 'NanumGothic',
        fontSize: 28,
        color: Color.MainColor
    },

    Medium: {
        fontFamily: 'NanumGothic',
        fontSize: 22,
        color: Color.MainColor
    },

    Detail: {
        fontFamily: 'NanumGothic',
        fontSize: 16,
        color: Color.MainColor
    },

    Marker : {
        fontFamily: 'NanumGothic',
        fontSize: 14,
        color: 'black',
    }
})