import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Button } from '@rneui/base';
import { BoxStyles } from '../../styles/Box.style';
import { ButtonStyles } from '../../styles/Button.style';
import { TextStyles } from '../../styles/Text.style';
import { DateInput, EmailInput, LabelInput, LabelSecretInput, NameInput } from '../../components/Input';
import { useState } from 'react';
import { CheckDuplicate, handleRegister } from '../../api/authAPI';
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
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={BoxStyles.P10}>
                    <View style={[BoxStyles.MainBox, BoxStyles.P10]}>
                        <LabelInput label={'ID'} placeholder={'아이디를 입력해주세요'} state={id} setState={setId}></LabelInput>
                        <LabelSecretInput label={'PW'} placeholder={'비밀번호를 입력해주세요'} state={password} setState={setPassword}></LabelSecretInput>
                        <EmailInput label={'E-mail'} placeholder={'이메일 ID'}
                            emailId={emailId} setEmailId={setEmailId} selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain}></EmailInput>
                        <NameInput label={'이름'} placeholder1={'성'} placeholder2={'이름'}
                            state1={fName} setState1={setFName} state2={sName} setState2={setSName}></NameInput>
                        <DateInput label={'생년월일'} date={date} setDate={setDate}></DateInput>
                        <Button buttonStyle={ButtonStyles.MainButton} title={'회원가입'} titleStyle={[TextStyles.FwBold]}
                            onPress={async () => {
                                if (!CheckSignUp(id, password, emailId, selectedDomain, fName, sName, date)) return // 입력했는지 체크
                                // id, email 중복체크
                                const checkDuplicate = await CheckDuplicate(id, `${emailId}@${selectedDomain}`)
                                if (!checkDuplicate) return
                                // 회원가입
                                handleRegister(id, password, `${emailId}@${selectedDomain}`, fName, sName, dateFormat(date), navigation)
                            }}></Button>
                        <Button buttonStyle={ButtonStyles.InputButton} titleStyle={TextStyles.Detail} title={'서비스를 이용해 본 적 있는거 같아요!'}
                            onPress={() => {
                                navigation.replace('Login')
                            }} />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function dateFormat(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let result = year + '-' + ((month < 10 ? '0' + month : month) + '-' + ((day < 10 ? '0' + day : day)))
    return result
}