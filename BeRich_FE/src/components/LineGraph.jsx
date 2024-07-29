import React, { useState, useMemo } from 'react';
import { processColor, View } from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';
import { BoxStyles } from '../styles/Box.style';
import { stockData } from "../resource/StockData";
import { dateFormatter, processLineData } from '../resource/ParseData';
import { Color } from '../resource/Color';
import { LineRenderMarker } from './RenderMarker';

export function LineGraph({ stock }) {
    const [selectedEntry, setSelectedEntry] = useState(null);

    // useMemo를 이용해 시간 오래걸리는 요소 감싸기
    const { lineChartData, timeData } = useMemo(() => {
        console.log('Processing data...');
        const data = processLineData(stockData);
        const dateData = data.map(item => dateFormatter(item.timestamp));
        return {
            lineChartData: data,
            timeData: dateData
        };
    }, [stock]);

    return (
        <View style={[{ height: 200 }, BoxStyles.ContainerBox]}>
            <LineChart
                style={{ flex: 1 }}
                data={{
                    dataSets: [{
                        values: lineChartData,
                        label: '주식 그래프(종가)',
                        config: {
                            color: processColor(Color.MainColor),
                            drawValues: false,
                            lineWidth: 2,
                            drawCircles: false,
                        }
                    }]
                }}
                chartDescription={{ text: '' }}
                xAxis={{
                    drawLabels: true,
                    position: 'BOTTOM',
                    valueFormatter: timeData, // timestamps로 x축 결정
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
                    scaleX: 1, // 초기 확대 비율
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
            <LineRenderMarker selectedEntry={selectedEntry} />
        </View>
    );
}
