import { StyleSheet } from "react-native";
import { Color } from "../resource/Color";

export const TextStyles = StyleSheet.create({
    FcWhite: {
        color: Color.White
    },

	Title: {
        fontSize: 40,
        color: Color.MainColor,
        fontWeight: 'bold'
    },

    Main: {
        fontSize: 28,
        color: Color.MainColor
    },

    Detail: {
        fontSize: 16,
        color: Color.MainColor
    },

    Marker : {
        fontSize: 14,
        color: 'black',
    }
})