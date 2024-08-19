import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

export default function UserInfoRefreshScreen({navigation}) {
    useFocusEffect(React.useCallback(()=>{
        navigation.replace('UserInfo')
    }, []))

    return(
        <View>
        </View>
    )
}