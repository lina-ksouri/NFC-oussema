import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native/types";
import NfcManager, {NfcEvents} from "react-native-nfc-manager";
import AndroidPrompt from "./AndroidPrompt";
import { SafeAreaView } from "react-native";

function Game(props) {
    const [start, setStart] =React.useState(null);
    const [duration, setDuration] = React.useState(0);
    const androidPromptRef = React.useRef();

    React.useEffect(() => {
        let count = 5;
        NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
            count--;
            if(Platform.OS === "android")
            {
                androidPromptRef.current.setHintText(`${count}...`);
            }
            else{
                NfcManager.setAlertMessageIOS(`${count}...`);
            }
            if(count <= 0)
            {
                NfcManager.unregidterTagEvent().catch(() => 0);
                setDuration(new Date().getTime() - start.getTime());
                if(Platform.OS === "android")
                {
                    androidPromptRef.current.setVisible(false);
                }
            }
        });

        return () => {
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        };
    }, [start]);

    async function scanTag() {
        await NfcManager.registerTagEvent();
        if(Platform.OS === "android")
        {
           androidPromptRef.current.setVisible(true);
        }
        setStart(new Date());
        setDuration(0);
    }

    return (
        <View style={styles.wrapper}>
            <SafeAreaView>

            
<Text style={styles.label}> NFC Game </Text>
<View style={styles.minLabel}>
    {(duration > 0 && (<Text style={styles.minLabel}>{duration} ms</Text>)) 
    || <Text style={styles.minLabel}>Let's go!</Text>}
</View>
<TouchableOpacity onPress= {scanTag}>
    <View style= {styles.btn}>
    <Text style= {styles.playLabel}>Start</Text>
    </View>
</TouchableOpacity>
<AndroidPrompt ref={androidPromptRef} onCancelPress={
    () => {
        NfcManager.unregisterTagEvent().catch(() => 0);
    }
}/>
</SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
        justifyContent: "center",
    },
    label: {
       fontSize: 40,
       color: "white",
       marginBottom: 10,
    },
    minLabel: {
        fontSize: 32,
        color: '#ccc',
        textAlign: "center"
    },
    playLabel: {
        fontSize: 28,
        color: 'black',
        textAlign: "center",

    },
    btn: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'white',
        backgroundColor: 'Pink',
        alignItems: "center",
        justifyContent: "center",
        margin: 15,
        padding: 15,
    },
});

export default Game;