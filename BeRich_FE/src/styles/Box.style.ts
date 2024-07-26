import { StyleSheet } from "react-native";
import { Color } from "../resource/Color";

export const BoxStyles = StyleSheet.create({
    W100: {
        width: '100%'
    },

    JCCenter: {
        justifyContent: 'center',
    },

    AICenter: {
        alignContent: 'center',
        alignItems: 'center'
    },

    P10: {
        padding: 10
    },
    P20: {
        padding: 20
    },

    Flex1: {
        flex: 1
    },

    MR10: {
        marginRight: 10
    },

    Mb10: {
        marginBottom: 10
    },
    Mb20: {
        marginBottom: 20
    },
    
    BgBlack: {
        backgroundColor: Color.MainColor,
    },

    ContainerBox: {
        width: '100%',
        flex: 1,
    },

	MainBox: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: Color.White,

        // 테두리
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Color.MainColor,
    },

    MainBoxTitle: {
        backgroundColor: Color.MainColor,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Color.MainColor,
        padding: 5,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7
    },

    MainBoxContent: {
        padding: 10,
    }
})