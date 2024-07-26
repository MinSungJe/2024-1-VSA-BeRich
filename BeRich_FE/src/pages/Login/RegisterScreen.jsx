import { View } from 'react-native';
import { Button } from '@rneui/base';
import { BoxStyles } from '../../styles/Box.style';
import { ButtonStyles } from '../../styles/Button.style';
import { TextStyles } from '../../styles/Text.style';
import { DateInput, EmailInput, LabelInput, LabelSecretInput, NameInput } from '../../components/Input';

export default function RegisterScreen({navigation}) {
    return (
        <View style={BoxStyles.ContainerBox}>
            <LabelInput label={'ID'} placeholder={'아이디를 입력해주세요'}></LabelInput>
            <LabelSecretInput label={'PW'} placeholder={'비밀번호를 입력해주세요'}></LabelSecretInput>
            <EmailInput label={'E-mail'} placeholder={'이메일 ID'}></EmailInput>
            <NameInput label={'이름'} placeholder1={'성을 입력해주세요'} placeholder2={'이름을 입력해주세요'}></NameInput>
            <DateInput label={'생년월일'}></DateInput>
            <Button buttonStyle={ButtonStyles.MainButton} title={'회원가입'}></Button>
            <Button buttonStyle={ButtonStyles.InputButton} titleStyle={TextStyles.Detail} title={'이미 계정이 있으면 여기를 눌러주세요'}
            onPress={()=>{
                navigation.navigate('Login')
            }}/>
        </View>
    );
}