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
    PV10: {
        paddingVertical: 10
    },
    PH10: {
        paddingHorizontal: 10
    },
    P20: {
        padding: 20
    },

    Flex1: {
        flex: 1
    },

    MT10: {
        marginTop: 10
    },
    MR10: {
        marginRight: 10
    },

    Mb5: {
        marginBottom: 5
    },
    Mb10: {
        marginBottom: 10
    },
    Mb20: {
        marginBottom: 20
    },
    Mb30: {
        marginBottom: 30
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
        borderRadius: 15,
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
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },

    MainBoxContent: {
        padding: 10,
    },

    MarkerBox: {
        opacity: 0.8,
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 10,
        borderColor: Color.MainColor,
        borderWidth: 1,
    },

    BottomGrayLine: {
        borderBottomColor: Color.Gray,
        borderBottomWidth: 1
    }
})