import { Text } from "@rneui/base";
import { useContext } from "react";
import { View } from "react-native";
import { AppContext } from "../../contexts/AppContext";

export default function AutoTradeScreen() {
    const {state, setState} = useContext(AppContext)
    return (
        <View>
            <Text>{state.selectedStock}</Text>
        </View>
    )
}