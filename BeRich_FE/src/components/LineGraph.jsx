import React, { useEffect, useState } from 'react';
import { processColor, Text, View } from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';
import { BoxStyles } from '../styles/Box.style';
import { stockData } from "../resource/StockData";
import { dateFormatter, processLineData } from '../resource/ParseData';
import { Color } from '../resource/Color';
import { RenderMarker } from './RenderMarker';

export function LineGraph({ stock }) {
    const [lineChartData, setLineChartData] = useState([]);
    const [dateTime, setDateTime] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
        // API에서 필요한 데이터 불러오기
        let data = processLineData(stockData);
        let timeData = (data.map(item => item.timestamp)).map(item => dateFormatter(item));
        setLineChartData(data);
        setDateTime(timeData);
    }, []);

    return (
        <View style={[{ height: 300 }, BoxStyles.ContainerBox]}>
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
                    valueFormatter: dateTime, // timestamps로 x축 결정
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
            <RenderMarker selectedEntry={selectedEntry} dateTime={dateTime} />
        </View>
    );
}
