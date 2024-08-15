import { View, Image } from "react-native";
import { TextStyles } from "../styles/Text.style";
import { Text } from "@rneui/base";
import { BoxStyles } from "../styles/Box.style";
import { parseStockData } from "../resource/ParseData";
import { getNewsAPI } from "../api/getNewsAPI";
import { useEffect, useState } from "react";

export default function News({ stock }) {
    const [news, setNews] = useState({ "date": "", "summary": "" })
    const [stockData, setStockData] = useState(null);

    // stock Data 사용가능하도록 변환
    useEffect(() => {
        const parsedData = parseStockData(stock);
        setStockData(parsedData);
    }, [stock]);

    useEffect(() => {
        if (stockData && stockData.stockCode) {
            async function getNewsData(stockCode) {
                const newsData = await getNewsAPI(stockCode);
                setNews(newsData);
            }
            getNewsData(stockData.stockCode);
        }
    }, [stockData]);

    if (!stockData) {
        return null; // 로딩중
    }

    return (
        <View>
            <View style={[{ flexDirection: 'row' }, BoxStyles.AICenter, BoxStyles.Mb10]}>
                <Image
                    source={require('../assets/image/icon-dummy.png')}
                    style={[{ width: 32, height: 32 }, BoxStyles.MR10]} />
                <Text style={[TextStyles.Main]}>{stockData.companyName}</Text>
            </View>
            <Text style={[TextStyles.Detail, TextStyles.FcDarkGray, BoxStyles.Mb5]}>{news.date}</Text>
            <Text style={[TextStyles.Detail]}>{news.summary}</Text>
        </View>
    )
}