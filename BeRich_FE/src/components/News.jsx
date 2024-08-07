import { View } from "react-native";
import { TextStyles } from "../styles/Text.style";
import { Text } from "@rneui/base";
import { BoxStyles } from "../styles/Box.style";
import { parseStockData } from "../resource/ParseData";

export default function News({stock}) {
    // stock Data 사용가능하도록 변환
    const stockData = parseStockData(stock)

    return (
        <View>
            <Text style={[TextStyles.Main, BoxStyles.Mb20]}>{stockData.companyName}</Text>
            <Text style={TextStyles.Detail}>서브입니다</Text>
        </View>
    )
}