import { View, Text } from "react-native";
import { TextStyles } from "../styles/Text.style";
import { BoxStyles } from "../styles/Box.style";
import { dateFormatter, dateTimeFormatter } from "../resource/ParseData";

// 라인그래프용 마커(종가, 시간)
export function LineRenderMarker({ selectedEntry }) {
    if (!selectedEntry) return null;

    const { y, data } = selectedEntry;
    return (
        data ?
            <View style={[BoxStyles.MarkerBox, { position: 'absolute', left: (selectedEntry.x * 2), top: -30 }]}>
                <Text style={TextStyles.Marker}>{`일자: ${dateFormatter(data.timestamp)}`}</Text>
                <Text style={TextStyles.Marker}>{`종가: ${y}`}</Text>
            </View>
            : null
    );
}

// 캔들그래프용 마커(시작, 마지막, 최고, 최저, 시간)
export function CandleRenderMarker({ graphType, selectedEntry, graphWidth, dataLength }) {
    if (!selectedEntry) return null;
    const { open, close, high, low, data } = selectedEntry;

    const ratio = selectedEntry.x / dataLength;
    const markerX = ratio > 0.5
        ? (graphType == '5d') ? ((selectedEntry.x - 8) / dataLength) * graphWidth : ((selectedEntry.x - 18) / dataLength) * graphWidth
        : ratio * graphWidth;

    return (
        data ?
            <View style={[BoxStyles.MarkerBox, { position: 'absolute', left: markerX, top: -30 }]}>
                {
                    (graphType == '5d') ?
                        <Text style={TextStyles.Marker}>{`일자: ${dateTimeFormatter(data.timestamp + 9 * 60 * 60 * 1000)}`}</Text>
                        :
                        <Text style={TextStyles.Marker}>{`일자: ${dateFormatter(data.timestamp)}`}</Text>
                }
                <Text style={TextStyles.Marker}>{`시가: ${Math.floor(open).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</Text>
                <Text style={TextStyles.Marker}>{`종가: ${Math.floor(close).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</Text>
                <Text style={TextStyles.Marker}>{`고가: ${Math.floor(high).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</Text>
                <Text style={TextStyles.Marker}>{`저가: ${Math.floor(low).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</Text>
            </View>
            : null
    );
}