import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";

export default function RefreshScreen({navigation}) {
    useFocusEffect(React.useCallback(()=>{
        navigation.replace('AutoTrade')
    }, []))

    return(
        <View>
        </View>
    )
}