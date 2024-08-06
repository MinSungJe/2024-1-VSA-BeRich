import { View } from "react-native";
import { TextStyles } from "../styles/Text.style";
import { Text } from "@rneui/base";
import { BoxStyles } from "../styles/Box.style";

export default function News({stock}) {
    return (
        <View>
            <Text style={[TextStyles.Main, BoxStyles.Mb20]}>{stock}</Text>
            <Text style={TextStyles.Detail}>서브입니다</Text>
        </View>
    )
}