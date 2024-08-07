import { View } from "react-native";
import { TextStyles } from "../styles/Text.style";
import { Text } from "@rneui/base";
import { BoxStyles } from "../styles/Box.style";
import { parseStockData } from "../resource/ParseData";
import { getNewsAPI } from "../api/getNewsAPI";

export default function News({stock}) {
    // stock Data 사용가능하도록 변환
    const stockData = parseStockData(stock)

    // 뉴스 정보 불러오기
    // const newsData = await getNewsAPI(stockData.stockCode)

    return (
        <View>
            <Text style={[TextStyles.Main, BoxStyles.Mb20]}>{stockData.companyName}</Text>
            {/* <Text style={[TextStyles.Detail, TextStyles.FcGray]}>{newsData.date}</Text> */}
            <Text style={TextStyles.Detail}>서브입니다</Text>
            {/* <Text style={[TextStyles.Detail]}>{newsData.summary}</Text> */}
        </View>
    )
}