import React, { useMemo, useState } from 'react';
import { processColor, View } from 'react-native';
import { stockData } from "../resource/StockData";
import { CandleStickChart } from 'react-native-charts-wrapper';
import { BoxStyles } from '../styles/Box.style';
import { dateFormatter, processCandleData } from '../resource/ParseData';
import { CandleRenderMarker } from './RenderMarker';
import { Color } from '../resource/Color';
import { getGraphDataAPI } from '../api/getGraphDataAPI';

export function CandleGraph({ stock, graphType }) {
    // stock Data 사용가능하도록 변환
    const stockData = parseStockData(stock)
    const [selectedEntry, setSelectedEntry] = useState(null);

    // useMemo를 이용해 시간 오래걸리는 요소 감싸기
    const { candleChartData, timeData } = useMemo(async () => {
        // const graphData = await getGraphDataAPI(stockData.stockCode, graphType)
        if (!graphData) return {
            candleChartData: null,
            timeData: null
        }
        const data = processCandleData(stockData);
        const dateData = data.map(item => dateFormatter(item.timestamp));
        return {
            candleChartData: data,
            timeData: dateData
        };
    }, [stock]);

    return (
        <View style={[{ height: 250 }, BoxStyles.ContainerBox]}>
            <CandleStickChart
                style={{ flex: 1 }}
                data={{
                    dataSets: [{
                        values: candleChartData,
                        label: '그래프',
                        config: {
                            color: processColor('teal'),
                            shadowColor: processColor('black'),
                            shadowWidth: 2,
                            shadowColorSameAsCandle: true,
                            increasingColor: processColor(Color.Red),
                            decreasingColor: processColor(Color.Blue),
                            increasingPaintStyle: 'FILL',
                            decreasingPaintStyle: 'FILL',
                            drawValues: false,
                        }
                    }]
                }}
                chartDescription={{ text: '' }}
                xAxis={{
                    drawLabels: true,
                    position: 'BOTTOM',
                    valueFormatter: timeData, // x축 레이블 설정
                    labelCount: 6,
                    granularityEnabled: true,
                    granularity: 1,
                    drawGridLines: false,
                    axisLineColor: processColor('grey'),
                    axisLineWidth: 1,
                    textColor: processColor('black'),
                    textSize: 12,
                }}
                yAxis={{
                    left: {
                        enabled: false
                    },
                    right: {
                        enabled: false
                    }
                }}
                autoScaleMinMaxEnabled={true}
                doubleTapToZoomEnabled={false}
                scaleXEnabled={true}
                scaleYEnabled={false}
                zoom={{
                    scaleX: 1, // 확대 비율 설정
                    scaleY: 1,
                    xValue: 0,
                    yValue: 0,
                    axisDependency: 'LEFT'
                }}
                pinchZoom={true}
                keepPositionOnRotation={false}
                onSelect={(event) => {
                    if (event.nativeEvent) {
                        setSelectedEntry(event.nativeEvent);
                    }
                }}
            />
            <CandleRenderMarker selectedEntry={selectedEntry}/>
        </View>
    );
}
