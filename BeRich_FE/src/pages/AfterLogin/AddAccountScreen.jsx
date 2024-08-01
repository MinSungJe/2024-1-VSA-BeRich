import { View } from "react-native";
import { BoxStyles } from "../../styles/Box.style";
import { useState } from "react";
import { LabelInput, LabelSecretInput } from "../../components/Input";
import { Button } from "@rneui/base";
import { ButtonStyles } from "../../styles/Button.style";
import { addAccountAPI, CheckAddAccount } from "../../api/addAccountAPI";

export default function AddAccountScreen({ navigation }) {
    const [accountNum, setAccountNum] = useState('');
    const [appKey, setAppKey] = useState('');
    const [appSecret, setAppSecret] = useState('');

    return (
        <View style={[BoxStyles.P10]}>
            <View style={[BoxStyles.MainBox, BoxStyles.P10]}>
                <LabelInput
                    label={'계좌번호 (한국투자증권)'}
                    placeholder={'계좌번호를 입력해주세요'}
                    state={accountNum}
                    setState={setAccountNum}
                />
                <LabelInput
                    label={'App-Key'}
                    placeholder={'App-Key를 입력해주세요'}
                    state={appKey}
                    setState={setAppKey}
                />
                <LabelSecretInput
                    label={'App-Secret'}
                    placeholder={'App-Secret을 입력해주세요'}
                    state={appSecret}
                    setState={setAppSecret}
                />
                <Button
                    buttonStyle={ButtonStyles.MainButton}
                    title={'저장'}
                    onPress={() => {
                        if (!CheckAddAccount(accountNum, appKey, appSecret)) return // 입력여부 체크
                        addAccountAPI(accountNum, appKey, appSecret, navigation)
                    }}
                />
            </View>
        </View>
    )
}