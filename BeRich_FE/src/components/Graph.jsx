import { GestureHandlerRootView } from "react-native-gesture-handler";
import { stockData } from "../resource/StockData";
import { CandlestickChart } from "react-native-wagmi-charts";

export function Graph({ stock }) {

    // api에서 필요한 data 불러오기
    const data = stockData

    return (
        <GestureHandlerRootView>
            <CandlestickChart.Provider data={data}>
                <CandlestickChart>
                    <CandlestickChart.Candles />
                    <CandlestickChart.Crosshair />
                </CandlestickChart>
                <CandlestickChart.DatetimeText />
            </CandlestickChart.Provider>
        </GestureHandlerRootView>
    )
}