import { View, Text } from "react-native";
import { TextStyles } from "../styles/Text.style";
import { BoxStyles } from "../styles/Box.style";

export function RenderMarker({ selectedEntry, dateTime }) {
    if (!selectedEntry) return null;

    const { x, y, data } = selectedEntry;
    return (
        data ?
            <View style={[BoxStyles.MarkerBox, { position: 'absolute', left: (selectedEntry.x) * 2, top: -30 }]}>
                <Text style={TextStyles.Marker}>{`일자: ${dateTime[x]}`}</Text>
                <Text style={TextStyles.Marker}>{`종가: ${y}`}</Text>
            </View>
            : null
    );
}