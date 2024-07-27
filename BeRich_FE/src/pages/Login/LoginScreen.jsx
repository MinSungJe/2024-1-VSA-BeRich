import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@rneui/base';
import { LabelInput, LabelSecretInput } from '../../components/Input';
import { ButtonStyles } from '../../styles/Button.style';
import { BoxStyles } from '../../styles/Box.style';
import { TextStyles } from '../../styles/Text.style';
import { handleLogin } from '../../api/loginAPI';

export default function LoginScreen({ navigation }) {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={BoxStyles.ContainerBox}>
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
                onPress={() => {
                    handleLogin(id, password)
                }}
            />
            <Button 
                buttonStyle={ButtonStyles.InputButton} 
                titleStyle={TextStyles.Detail} 
                title={'계정이 없나요?'}
                onPress={() => navigation.navigate('Register')}
            />
        </View>
    );
}
