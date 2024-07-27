import { View } from 'react-native';
import { BoxStyles } from '../styles/Box.style';
import { TextStyles } from '../styles/Text.style';
import { Button, Input, Text } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import DatePicker from 'react-native-date-picker'
import { ButtonStyles } from '../styles/Button.style';

export function LabelInput({ label, placeholder, state, setState }) {
    return (
        <View style={BoxStyles.P10}>
            <Text style={TextStyles.Main}>{label}</Text>
            <Input placeholder={placeholder}
                value={state}
                onChangeText={setState} />
        </View>
    )
}

export function LabelSecretInput({ label, placeholder, state, setState }) {
    return (
        <View style={BoxStyles.P10}>
            <Text style={TextStyles.Main}>{label}</Text>
            <Input placeholder={placeholder}
                secureTextEntry={true}
                value={state}
                onChangeText={setState} />
        </View>
    )
}

export function EmailInput({ label, placeholder }) {
    const [selectedDomain, setSelectedDomain] = useState();

    return (
        <View style={BoxStyles.P10}>
            <Text style={TextStyles.Main}>{label}</Text>
            <View style={[{ flexDirection: 'row' }, BoxStyles.W100, BoxStyles.JCCenter, BoxStyles.AICenter]}>
                <Input containerStyle={{ flex: 1 }} placeholder={placeholder} />
                <Text style={{ flexShrink: 0, textAlignVertical: 'center' }}>@</Text>
                <Picker
                    style={{ flex: 1 }}
                    selectedValue={selectedDomain}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedDomain(itemValue)
                    }>
                    <Picker.Item label="naver.com" value="naver.com" />
                    <Picker.Item label="gmail.com" value="gmail.com" />
                    <Picker.Item label="daum.net" value="daum.net" />
                </Picker>
            </View>
        </View>
    )
}

export function NameInput({ label, placeholder1, placeholder2 }) {
    return (
        <View style={BoxStyles.P10}>
            <Text style={TextStyles.Main}>{label}</Text>
            <View style={[{ flexDirection: 'row' }, BoxStyles.W100, BoxStyles.JCCenter, BoxStyles.AICenter]}>
                <Input containerStyle={{ flex: 1 }} placeholder={placeholder1} />
                <Input containerStyle={{ flex: 1 }} placeholder={placeholder2} />
            </View>
        </View>
    )
}

export function DateInput({ label }) {
    const [date, setDate] = useState(new Date())
    const [dateLabel, setDateLabel] = useState('')
    const [open, setOpen] = useState(false)

    function dateFormat(date) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let result = year + '-' + ((month < 10 ? '0' + month : month) + '-' + ((day < 10 ? '0' + day : day)))
        return result
    }

    useEffect(() => {
        setDateLabel(dateFormat(date))
    }, [])

    return (
        <View style={[BoxStyles.P10]}>
            <Text style={[TextStyles.Main, BoxStyles.Mb10]}>{label}</Text>
            <View style={[{ flexDirection: 'row' }, BoxStyles.AICenter, BoxStyles.P10]}>
                <Text style={[TextStyles.Detail, BoxStyles.MR10]}>{dateLabel}</Text>
                <Button title={'변경'} onPress={() => setOpen(true)} buttonStyle={ButtonStyles.MainButton} />
                <DatePicker
                    modal
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                        setDateLabel(dateFormat(date))
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                    mode='date'
                />
            </View>
        </View>
    )
}