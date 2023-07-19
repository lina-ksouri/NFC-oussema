import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import Game from "./Game";
import AndroidPrompt from "./AndroidPrompt";

function App(props)
{
    const [hasNfc, seltHasNfc] = React.useState(null);
    //const promptRef = React.useRef();
    const [enabled, setEnabled] = React.useState(null);

    React.useEffect(() => {
        async function checkNfc() {
            const supported = await NfcManager.isSupported();
            if(supported)
            {
                await NfcManager.start();
                setEnabled(await NfcManager.isEnabled());
            }
            seltHasNfc(supported);
        }
        checkNfc(supported);
    }, []);

    if(hasNfc === null)
    {
        return null;
    }
    else if(!hasNfc)
    {
        return (
            <View style= {styles.wrapper}>
                <Text>You device dosen't support NFC </Text>
               {/*
                <TouchableOpacity onPress={() => {
                        promptRef.current.setVisible(true);
                    }}>
                    <Text>test</Text>
                </TouchableOpacity>
                <AndroidPrompt ref={promptRef} />
                */}
                </View>
        );
    }
    else if(!enabled)
    {
        return (
            <View style= {styles.wrapper}>
                <Text>You NFC is not enabled </Text>
                <TouchableOpacity onPress={() => {
                        NfcManager.goToNfcSetting();
                    }}>
                    <Text>GO TO SETTINGS</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={async() => {
                        setEnabled(await NfcManager.isEnabled());
                    }}>
                    <Text>CHECK AGAIN</Text>
                </TouchableOpacity>
                </View>
        );
    }
    return <Game />
}


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default App;