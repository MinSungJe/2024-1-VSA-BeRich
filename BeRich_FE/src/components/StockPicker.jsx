import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StockList } from '../resource/StockList';

export function StockPicker({stock, setStock}) {
    return (
        <View>
            <Picker
                selectedValue={stock}
                onValueChange={(itemValue) =>
                    setStock(itemValue)}>
                {StockList.map((element, id) => <Picker.Item key={id} label={`${element.companyName} (${element.stockCode})`} value={JSON.stringify(element)} />)}
            </Picker>
        </View>
    )
}