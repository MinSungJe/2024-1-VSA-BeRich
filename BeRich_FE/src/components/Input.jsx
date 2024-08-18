import { Alert, View } from 'react-native';
import { BoxStyles } from '../styles/Box.style';
import { TextStyles } from '../styles/Text.style';
import { Button, Input, Text } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import DatePicker from 'react-native-date-picker'
import { ButtonStyles } from '../styles/Button.style';
import { dateFormat } from '../resource/ParseData';

export function LabelInput({ label, placeholder, state, setState }) {
    return (
        <View style={BoxStyles.P10}>
            <Text style={[TextStyles.Medium, TextStyles.FwBold]}>{label}</Text>
            <Input placeholder={placeholder}
                value={state}
                onChangeText={setState} />
        </View>
    )
}

export function LabelSecretInput({ label, placeholder, state, setState }) {
    return (
        <View style={BoxStyles.P10}>
            <Text style={[TextStyles.Medium, TextStyles.FwBold]}>{label}</Text>
            <Input placeholder={placeholder}
                secureTextEntry={true}
                value={state}
                onChangeText={setState} />
        </View>
    )
}

export function EmailInput({ label, placeholder, emailId, setEmailId, selectedDomain, setSelectedDomain }) {

    return (
        <View style={BoxStyles.P10}>
            <Text style={[TextStyles.Medium, TextStyles.FwBold]}>{label}</Text>
            <View style={[{ flexDirection: 'row' }, BoxStyles.W100, BoxStyles.JCCenter, BoxStyles.AICenter]}>
                <Input containerStyle={{ flex: 1 }} placeholder={placeholder} value={emailId} onChangeText={text => {
                    setEmailId(text)
                }} />
                <Text style={{ flexShrink: 0, textAlignVertical: 'center' }}>@</Text>
                <Picker
                    style={{ flex: 1 }}
                    selectedValue={selectedDomain}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedDomain(itemValue)
                    }
                    }>
                    <Picker.Item label="선택" value="" />
                    <Picker.Item label="naver.com" value="naver.com" />
                    <Picker.Item label="gmail.com" value="gmail.com" />
                    <Picker.Item label="daum.net" value="daum.net" />
                </Picker>
            </View>
        </View>
    )
}

export function NameInput({ label, placeholder1, placeholder2, state1, state2, setState1, setState2 }) {
    return (
        <View style={BoxStyles.P10}>
            <Text style={[TextStyles.Medium, TextStyles.FwBold]}>{label}</Text>
            <View style={[{ flexDirection: 'row' }, BoxStyles.W100, BoxStyles.JCCenter, BoxStyles.AICenter]}>
                <Input containerStyle={{ flex: 1 }} placeholder={placeholder1} value={state1} onChangeText={setState1} />
                <Input containerStyle={{ flex: 1 }} placeholder={placeholder2} value={state2} onChangeText={setState2} />
            </View>
        </View>
    )
}

export function DateInput({ label, date, setDate }) {
    const [dateLabel, setDateLabel] = useState('')
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setDateLabel(dateFormat(date))
    }, [])

    return (
        <View style={[BoxStyles.P10]}>
            <Text style={[TextStyles.Medium, TextStyles.FwBold, BoxStyles.Mb10]}>{label}</Text>
            <View style={[{ flexDirection: 'row' }, BoxStyles.AICenter, BoxStyles.P10]}>
                <Text style={[TextStyles.Detail, BoxStyles.MR10]}>{dateLabel}</Text>
                <Button title={'변경'} onPress={() => setOpen(true)} buttonStyle={ButtonStyles.MainButton} titleStyle={[TextStyles.FwBold]} />
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
                    confirmText='확인'
                    cancelText='취소'
                />
            </View>
        </View>
    )
}

export function DateSpinnerTomorrow({ title, date, setDate, startDay }) {
    const [dateLabel, setDateLabel] = useState('');
    const [open, setOpen] = useState(false);

    // 주말 여부 확인 함수
    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // 0: 일요일, 6: 토요일
    };

    // startDay 다음 날로 초기 endDay 설정, 주말이면 다음 월요일로 이동
    const calculateInitialEndDate = () => {
        let initialDate = new Date(startDay);
        initialDate.setDate(initialDate.getDate() + 1);
        initialDate.setHours(0, 0, 0, 0); // 시간은 00:00:00으로 설정

        // 주말인 경우 다음 월요일로 이동
        if (isWeekend(initialDate)) {
            initialDate.setDate(initialDate.getDate() + (initialDate.getDay() === 6 ? 2 : 1)); // 토요일이면 +2, 일요일이면 +1
        }

        return initialDate;
    };

    const initialEndDate = calculateInitialEndDate();

    useEffect(() => {
        setDateLabel(dateFormat(initialEndDate));
    }, []);

    return (
        <View style={[{ flexDirection: 'row' }, BoxStyles.AICenter, BoxStyles.P10]}>
            <Text style={[TextStyles.Detail, BoxStyles.MR10]}>{dateLabel}</Text>
            <Button title={'변경'} onPress={() => setOpen(true)} buttonStyle={ButtonStyles.MainButton} titleStyle={[TextStyles.FwBold]} />
            <DatePicker
                modal
                title={title}
                open={open}
                date={initialEndDate}
                onConfirm={(selectedDate) => {
                    // 선택된 날짜가 주말이면 다시 선택하게 함
                    if (isWeekend(selectedDate)) {
                        Alert.alert('경고', '주말은 선택할 수 없습니다.');
                        setOpen(false);
                        return
                    }
                    setOpen(false);
                    setDate(selectedDate);
                    setDateLabel(dateFormat(selectedDate));
                }}
                onCancel={() => {
                    setOpen(false);
                }}
                mode='date'
                minimumDate={initialEndDate} // startDay 다음 날부터 선택 가능
                confirmText='확인'
                cancelText='취소'
            />
        </View>
    );
}