import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Button } from '@rneui/base';
import { LabelInput, LabelSecretInput } from '../../components/Input';
import { ButtonStyles } from '../../styles/Button.style';
import { BoxStyles } from '../../styles/Box.style';
import { TextStyles } from '../../styles/Text.style';
import { handleLogin } from '../../api/authAPI';
import { CheckLogin } from './CheckSignup';

export default function LoginScreen({ navigation }) {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={BoxStyles.P10}>
                    <View style={[BoxStyles.MainBox, BoxStyles.P10]}>
                        <LabelInput
                            label={'ID'}
                            placeholder={'아이디를 입력해주세요'}
                            state={id}
                            setState={setId}
                        />
                        <LabelSecretInput
                            label={'PW'}
                            placeholder={'비밀번호를 입력해주세요'}
                            state={password}
                            setState={setPassword}
                        />
                        <Button
                            buttonStyle={ButtonStyles.MainButton}
                            title={'로그인'}
                            titleStyle={[TextStyles.FwBold]}
                            onPress={async () => {
                                if (!CheckLogin(id, password)) return // 입력했는지 체크
                                handleLogin(id, password, navigation)
                            }}
                        />
                        <Button
                            buttonStyle={ButtonStyles.InputButton}
                            titleStyle={TextStyles.Detail}
                            title={'저희 서비스는 처음인가요?'}
                            onPress={() => navigation.replace('Register')}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
