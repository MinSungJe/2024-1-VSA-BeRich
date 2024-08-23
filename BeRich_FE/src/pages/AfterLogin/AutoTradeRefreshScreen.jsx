import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

export default function AutoTradeRefreshScreen({navigation}) {
    useFocusEffect(React.useCallback(()=>{
        setTimeout(() => {
            navigation.replace('AutoTrade')
        }, 1000);
    }, []))

    return(
        <View>
        </View>
    )
}