import { View } from "react-native";
import { TextStyles } from "../styles/Text.style";
import { Text } from "@rneui/base";
import { BoxStyles } from "../styles/Box.style";
import { parseStockData } from "../resource/ParseData";
import { getNewsAPI } from "../api/getNewsAPI";
import { useEffect, useState } from "react";

export default function News({ stock }) {
    const [news, setNews] = useState({"date": "", "summary": ""})

    // stock Data 사용가능하도록 변환
    const stockData = parseStockData(stock)

    useEffect(() => {
        async function getNewsData(stockCode) {
            const newsData = await getNewsAPI(stockCode)
            setNews(newsData)
        }
        getNewsData(stockData.stockCode)
    }, [stock])

    return (
        <View>
            <Text style={[TextStyles.Main, BoxStyles.Mb10]}>{stockData.companyName}</Text>
            <Text style={[TextStyles.Detail, TextStyles.FcGray, BoxStyles.Mb5]}>{news.date}</Text>
            <Text style={[TextStyles.Detail]}>{news.summary}</Text>
        </View>
    )
}