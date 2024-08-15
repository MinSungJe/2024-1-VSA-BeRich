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

    const images = {
        '000150': require(`../assets/image/company/icon-000150.png`),
        '005930': require(`../assets/image/company/icon-005930.png`),
        '035720': require(`../assets/image/company/icon-035720.png`),
        '300720': require(`../assets/image/company/icon-300720.png`),
        '352820': require(`../assets/image/company/icon-352820.png`)
    }

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
                    source={images[stockData.stockCode] || require('../assets/image/icon-dummy.png')}
                    style={[{ width: 32, height: 32 }, BoxStyles.MR10]} />
                <Text style={[TextStyles.Main]}>{stockData.companyName}</Text>
            </View>
            <Text style={[TextStyles.Detail, TextStyles.FcDarkGray, BoxStyles.Mb5]}>{news.date}</Text>
            <Text style={[TextStyles.Detail]}>{news.summary}</Text>
        </View>
    )
}