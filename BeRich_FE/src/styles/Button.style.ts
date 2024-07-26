import { StyleSheet } from "react-native";
import { Color } from "../resource/Color";

export const ButtonStyles = StyleSheet.create({
	MainButton: {
        backgroundColor: Color.MainColor,
        padding: 10,
        borderRadius: 10,
    },

    InputButton: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: Color.MainColor,
    }
})