import { ScrollView, Text, View } from "react-native";
import { BoxStyles } from "../../styles/Box.style";
import { TextStyles } from "../../styles/Text.style";

export default function DescriptionScreen() {
    return (
        <ScrollView style={[BoxStyles.P10]}>
            <View style={[BoxStyles.MainBox, BoxStyles.P10, BoxStyles.Mb10]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.P10]}>
                    <Text style={[TextStyles.Medium, TextStyles.FwBold]}>SMA_10 & EMA_10</Text>
                </View>
                <View style={[BoxStyles.P10]}>
                    <Text style={[TextStyles.Detail]}>단기 이동 평균은 즉각적인 추세 방향을 파악하는 데 도움이 됩니다. SMA_10(단순 이동 평균)은 간단한 추세선을 제공하는 반면, EMA_10(지수 이동 평균)은 최근 가격에 더 많은 가중치를 두어, 추세 변화를 더 빨리 포착할 수 있습니다.</Text>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.P10, BoxStyles.Mb10]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.P10]}>
                    <Text style={[TextStyles.Medium, TextStyles.FwBold]}>RSI_15</Text>
                </View>
                <View style={[BoxStyles.P10]}>
                    <Text style={[TextStyles.Detail]}>상대 강도 지수(Relative Strength Index, RSI)는 0에서 100까지의 척도로 과매수 또는 과매도 상태를 측정합니다. RSI 값이 30 이하이면 매수 신호, 70 이상이면 매도 신호를 나타낼 수 있습니다.</Text>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.P10, BoxStyles.Mb10]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.P10]}>
                    <Text style={[TextStyles.Medium, TextStyles.FwBold]}>MACD</Text>
                </View>
                <View style={[BoxStyles.P10]}>
                    <Text style={[TextStyles.Detail]}>이동 평균 수렴·확산(Moving Average Convergence Divergence, MACD)은 가격의 두 이동 평균 간의 관계를 추적합니다. MACD가 신호선 위로 교차하면 상승 모멘텀을 나타내고, 아래로 교차하면 하락 모멘텀을 나타냅니다.</Text>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.P10, BoxStyles.Mb10]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.P10]}>
                    <Text style={[TextStyles.Medium, TextStyles.FwBold]}>Stochastic Oscillator</Text>
                </View>
                <View style={[BoxStyles.P10]}>
                    <Text style={[TextStyles.Detail]}>특정 기간 동안의 가격 범위와 특정 종목의 종가를 비교하는 모멘텀 지표입니다. 이 지표는 두 개의 선으로 구성되며, %K(빠른 선)와 %D(느린 선)로 구분됩니다. 80 이상이면 과매수 상태를, 20 이하이면 과매도 상태를 나타냅니다.</Text>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.P10, BoxStyles.Mb20]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.P10]}>
                    <Text style={[TextStyles.Medium, TextStyles.FwBold]}>Bollinger Bands</Text>
                </View>
                <View style={[BoxStyles.P10]}>
                    <Text style={[TextStyles.Detail]}>세 개의 선으로 구성된 이 지표에서, 가운데 선은 20일 평균 가격이며, 두 개의 외부 선은 가격 변동성에 따라 조정됩니다. 외부 밴드는 변동성이 클 때 넓어지고, 변동성이 적을 때 좁아집니다. 이 지표는 가격이 너무 높거나(상단 밴드에 닿는 경우) 너무 낮을 때(하단 밴드에 닿는 경우) 잠재적인 시장 움직임을 식별하는 데 도움이 됩니다.</Text>
                </View>
            </View>
        </ScrollView>
    )
}