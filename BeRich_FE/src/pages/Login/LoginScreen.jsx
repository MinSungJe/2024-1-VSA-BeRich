import { View } from 'react-native';
import { Button } from '@rneui/base';
import { LabelInput, LabelSecretInput } from '../../components/Input';
import { ButtonStyles } from '../../styles/Button.style';
import { BoxStyles } from '../../styles/Box.style';
import { TextStyles } from '../../styles/Text.style';

export default function LoginScreen({navigation}) {
    return (
        <View style={BoxStyles.ContainerBox}>
            <LabelInput label={'ID'} placeholder={'아이디를 입력해주세요'}></LabelInput>
            <LabelSecretInput label={'PW'} placeholder={'비밀번호를 입력해주세요'}></LabelSecretInput>
            <Button buttonStyle={ButtonStyles.MainButton} title={'로그인'}></Button>
            <Button buttonStyle={ButtonStyles.InputButton} titleStyle={TextStyles.Detail} title={'계정이 없나요?'}
            onPress={()=>{
                navigation.navigate('Register')
            }}/>
        </View>
    );
}