import { View } from 'react-native';
import { Button } from '@rneui/base';
import { BoxStyles } from '../../styles/Box.style';
import { ButtonStyles } from '../../styles/Button.style';
import { TextStyles } from '../../styles/Text.style';
import { DateInput, EmailInput, LabelInput, LabelSecretInput, NameInput } from '../../components/Input';
import { useState } from 'react';
import { handleRegister } from '../../api/authAPI';
import { CheckSignUp } from './CheckSignup';

export default function RegisterScreen({ navigation }) {

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [emailId, setEmailId] = useState('')
    const [selectedDomain, setSelectedDomain] = useState('')
    const [fName, setFName] = useState('')
    const [sName, setSName] = useState('')
    const [date, setDate] = useState(new Date())

    return (
        <View style={BoxStyles.ContainerBox}>
            <LabelInput label={'ID'} placeholder={'아이디를 입력해주세요'} state={id} setState={setId}></LabelInput>
            <LabelSecretInput label={'PW'} placeholder={'비밀번호를 입력해주세요'} state={password} setState={setPassword}></LabelSecretInput>
            <EmailInput label={'E-mail'} placeholder={'이메일 ID'}
                emailId={emailId} setEmailId={setEmailId} selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain}></EmailInput>
            <NameInput label={'이름'} placeholder1={'성을 입력해주세요'} placeholder2={'이름을 입력해주세요'}
                state1={fName} setState1={setFName} state2={sName} setState2={setSName}></NameInput>
            <DateInput label={'생년월일'} date={date} setDate={setDate}></DateInput>
            <Button buttonStyle={ButtonStyles.MainButton} title={'회원가입'}
                onPress={() => {
                    if (!CheckSignUp(id, password, emailId, selectedDomain, fName, sName, date)) return // 입력했는지 체크
                    handleRegister(id, password, `${emailId}@${selectedDomain}`, fName, sName, dateFormat(date))
                }}></Button>
            <Button buttonStyle={ButtonStyles.InputButton} titleStyle={TextStyles.Detail} title={'이미 계정이 있으면 여기를 눌러주세요'}
                onPress={() => {
                    navigation.navigate('Login')
                }} />
        </View>
    );
}

function dateFormat(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let result = year + '-' + ((month < 10 ? '0' + month : month) + '-' + ((day < 10 ? '0' + day : day)))
    return result
}