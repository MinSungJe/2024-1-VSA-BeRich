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
                    <Text style={[TextStyles.Detail]}>Short-term moving averages that help identify immediate trend directions. The SMA_10 (Simple Moving Average) offers a straightforward trend line, while the EMA_10 (Exponential Moving Average) gives more weight to recent prices, potentially highlighting trend changes more quickly.</Text>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.P10, BoxStyles.Mb10]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.P10]}>
                    <Text style={[TextStyles.Medium, TextStyles.FwBold]}>RSI_15</Text>
                </View>
                <View style={[BoxStyles.P10]}>
                    <Text style={[TextStyles.Detail]}>The Relative Strength Index measures overbought or oversold conditions on a scale of 0 to 100. Measures overbought or oversold conditions. Values below 30 or above 70 indicate potential buy or sell signals respectively.</Text>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.P10, BoxStyles.Mb10]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.P10]}>
                    <Text style={[TextStyles.Medium, TextStyles.FwBold]}>MACD</Text>
                </View>
                <View style={[BoxStyles.P10]}>
                    <Text style={[TextStyles.Detail]}>Moving Average Convergence Divergence tracks the relationship between two moving averages of a price. A MACD crossing above its signal line suggests bullish momentum, whereas crossing below indicates bearish momentum.</Text>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.P10, BoxStyles.Mb10]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.P10]}>
                    <Text style={[TextStyles.Medium, TextStyles.FwBold]}>Stochastic Oscillator</Text>
                </View>
                <View style={[BoxStyles.P10]}>
                    <Text style={[TextStyles.Detail]}>A momentum indicator comparing a particular closing price of a security to its price range over a specific period. It consists of two lines: %K (fast) and %D (slow). Readings above 80 indicate overbought conditions, while those below 20 suggest oversold conditions.</Text>
                </View>
            </View>
            <View style={[BoxStyles.MainBox, BoxStyles.P10, BoxStyles.Mb20]}>
                <View style={[BoxStyles.BottomGrayLine, BoxStyles.P10]}>
                    <Text style={[TextStyles.Medium, TextStyles.FwBold]}>Bollinger Bands</Text>
                </View>
                <View style={[BoxStyles.P10]}>
                    <Text style={[TextStyles.Detail]}>A set of three lines: the middle is a 20-day average price, and the two outer lines adjust based on price volatility. The outer bands widen with more volatility and narrow when less. They help identify when prices might be too high (touching the upper band) or too low (touching the lower band), suggesting potential market moves.</Text>
                </View>
            </View>
        </ScrollView>
    )
}