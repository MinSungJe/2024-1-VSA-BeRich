import React, { useEffect, useState } from 'react';
import { processColor, View } from 'react-native';
import { stockData } from "../resource/StockData";
import { CandleStickChart } from 'react-native-charts-wrapper';
import { BoxStyles } from '../styles/Box.style';
import { dateFormatter, processCandleData } from '../resource/ParseData';
import { CandleRenderMarker } from './RenderMarker';

export function CandleGraph({ stock }) {
    const [candleChartData, setCandleChartData] = useState([]);
    const [timeData, setTimeData] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
        // API에서 필요한 데이터 불러오기
        let data = processCandleData(stockData);
        let timeData = (data.map(item => item.timestamp)).map(item => dateFormatter(item));
        setCandleChartData(data)
        setTimeData(timeData);
    }, [])

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
                            increasingColor: processColor('green'),
                            decreasingColor: processColor('red'),
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
