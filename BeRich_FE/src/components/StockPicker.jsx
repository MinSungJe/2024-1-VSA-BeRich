import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { getStockListAPI } from '../api/getStockListAPI';

export function StockPicker({stock, setStock}) {
    const [stockList, setStockList] = useState([])

    useFocusEffect(
        React.useCallback(() => {
            async function getStockListData() {
                const stockListData = await getStockListAPI()
                setStockList(stockListData)
            }
            getStockListData();
        }, [])
    );

    return (
        <View>
            <Picker
                selectedValue={stock}
                onValueChange={(itemValue) =>
                    setStock(itemValue)}>
                {stockList.map((element, id) => <Picker.Item key={id} label={`${element.companyName} (${element.stockCode})`} value={JSON.stringify(element)} />)}
            </Picker>
        </View>
    )
}