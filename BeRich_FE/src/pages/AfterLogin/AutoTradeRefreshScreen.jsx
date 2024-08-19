import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

export default function AutoTradeRefreshScreen({navigation}) {
    useFocusEffect(React.useCallback(()=>{
        navigation.replace('AutoTrade')
    }, []))

    return(
        <View>
        </View>
    )
}