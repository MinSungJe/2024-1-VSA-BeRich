import React, { useEffect, useState } from 'react';
import { processColor, View } from 'react-native';
import { stockData } from "../resource/StockData";
import { CandleStickChart } from 'react-native-charts-wrapper';
import { BoxStyles } from '../styles/Box.style';
import { dateFormatter, processCandleData } from '../resource/ParseData';

export function CandleGraph({ stock }) {
    let [candleChartData, setCandleChartData] = useState([])

    useEffect(() => {
        // api에서 필요한 data 불러오기
        const temp = processCandleData(stockData);
        setCandleChartData(temp)
    }, [])

    // x축 레이블에 사용할 timestamp 배열 생성
    const timestamps = (candleChartData.map(item => item.timestamp)).map(item => dateFormatter(item));

    return (
        <View style={[{ height: 500 }, BoxStyles.ContainerBox]}>
            <CandleStickChart
                style={{ flex: 1 }}
                data={{
                    dataSets: [{
                        values: candleChartData,
                        label: 'Candle Data',
                        config: {
                            color: processColor('teal'),
                            shadowColor: processColor('black'),
                            shadowWidth: 1,
                            shadowColorSameAsCandle: true,
                            increasingColor: processColor('green'),
                            decreasingColor: processColor('red'),
                            increasingPaintStyle: 'FILL',
                            decreasingPaintStyle: 'FILL',
                        }
                    }]
                }}
                chartDescription={{ text: '' }}
                legend={{
                    enabled: true,
                    textColor: processColor('black'),
                    textSize: 12,
                    form: 'SQUARE',
                    formSize: 12,
                    xEntrySpace: 10,
                    yEntrySpace: 5,
                    formToTextSpace: 5,
                    wordWrapEnabled: true,
                    maxSizePercent: 0.5
                }}
                xAxis={{
                    drawLabels: true,
                    position: 'BOTTOM',
                    valueFormatter: timestamps, // timestamps로 x축 결정
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
                        drawLabels: true,
                        drawAxisLine: true,
                        drawGridLines: true,
                        axisLineColor: processColor('grey'),
                        axisLineWidth: 1,
                        textColor: processColor('black'),
                        textSize: 12,
                    },
                    right: {
                        enabled: false
                    }
                }}
                autoScaleMinMaxEnabled={true}
                doubleTapToZoomEnabled={false}
                scaleXEnabled={true}
                scaleYEnabled={true}
                zoom={{
                    scaleX: 2, // 확대 비율 설정
                    scaleY: 1,
                    xValue: 0,
                    yValue: 0,
                    axisDependency: 'LEFT'
                }}
                pinchZoom={true}
                keepPositionOnRotation={false}
            />
        </View>
    );
}
