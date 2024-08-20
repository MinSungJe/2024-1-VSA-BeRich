import React, { useState, useCallback, useEffect } from 'react';
import { processColor, View } from 'react-native';
import { CandleStickChart } from 'react-native-charts-wrapper';
import { BoxStyles } from '../styles/Box.style';
import { dateFormatter, parseStockData, processCandleData } from '../resource/ParseData';
import { CandleRenderMarker } from './RenderMarker';
import { Color } from '../resource/Color';
import { getGraphDataAPI } from '../api/getGraphDataAPI';

export function CandleGraph({ stock, graphType }) {
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [graphWidth, setGraphWidth] = useState(0);
    const [stockGraphData, setStockGraphData] = useState([]);
    const [stockData, setStockData] = useState(null);
    const [candleChartData, setCandleChartData] = useState([{ 'shadowH': 0, 'shadowL': 0, 'open': 0, 'close': 0 }]);
    const [timeData, setTimeData] = useState([]);

    // stock Data 사용가능하도록 변환
    useEffect(() => {
        const parsedData = parseStockData(stock);
        setStockData(parsedData);
    }, [stock]);

    // stockData가지고 그래프 데이터 API 호출
    useEffect(() => {
        if (stockData && stockData.stockCode) {
            // API 불러오기
            async function getGraphData(stockCode, graphType) {
                const graphData = await getGraphDataAPI(stockCode, graphType);
                setStockGraphData(graphData)
            }
            getGraphData(stockData.stockCode, graphType);
        }
    }, [stockData, graphType]);

    // 데이터 조정
    useEffect(() => {
        const data = processCandleData(stockGraphData);
        const dateData = data.map(item => dateFormatter(item.timestamp));
        setCandleChartData(data);
        setTimeData(dateData);
    }, [stockGraphData])


    // 그래프가 그려졌을 때 width 계산
    const onLayout = useCallback(event => {
        const { width } = event.nativeEvent.layout;
        setGraphWidth(width);
    }, []);

    if (!stockData || candleChartData.length === 0 || timeData.length === 0) {
        return null; // 로딩중
    }

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
            <CandleRenderMarker graphType={graphType} selectedEntry={selectedEntry} graphWidth={graphWidth} dataLength={candleChartData.length} />
        </View>
    );
}
