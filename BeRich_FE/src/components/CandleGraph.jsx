import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { processColor, View } from 'react-native';
import { CandleStickChart } from 'react-native-charts-wrapper';
import { BoxStyles } from '../styles/Box.style';
import { dateFormatter, parseStockData, processCandleData } from '../resource/ParseData';
import { CandleRenderMarker } from './RenderMarker';
import { Color } from '../resource/Color';
import { getGraphDataAPI } from '../api/getGraphDataAPI';
import { stock5dData } from '../resource/StockData';

export function CandleGraph({ stock, graphType }) {    
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [graphWidth, setGraphWidth] = useState(0);
    const [stockGraphData, setStockGraphData] = useState([
        {
            "timestamp": 0,
            "open": 0,
            "high": 0,
            "low": 0,
            "close": 0,
            "volume": 0
        }
    ])
    const [stockData, setStockData] = useState(null);

    // stock Data 사용가능하도록 변환
    useEffect(() => {
        const parsedData = parseStockData(stock);
        setStockData(parsedData);
    }, [stock]);

    // useMemo를 이용해 시간 오래걸리는 요소 감싸기
    const { candleChartData, timeData } = useMemo(() => {
        if (stockData && stockData.stockCode) {
            // API 불러오기
            async function getGraphData(stockCode, graphType) {
                const graphData = await getGraphDataAPI(stockCode, graphType)
                setStockGraphData(graphData)
            }
            getGraphData(stockData.stockCode, graphType)
        }

        const data = processCandleData(stock5dData);
        const dateData = data.map(item => dateFormatter(item.timestamp));
        return {
            candleChartData: data,
            timeData: dateData
        };
    }, [stockData]);

    // 그래프가 그려졌을 때 width 계산
    const onLayout = useCallback(event => {
        const { width } = event.nativeEvent.layout;
        setGraphWidth(width);
    }, []);

    return (
        <View style={[{ height: 250 }, BoxStyles.ContainerBox]} onLayout={onLayout}>
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
            <CandleRenderMarker selectedEntry={selectedEntry} graphWidth={graphWidth} dataLength={candleChartData.length} />
        </View>
    );
}
