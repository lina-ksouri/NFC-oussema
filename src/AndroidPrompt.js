import React from "react";
import { View , Text, Modal, StyleSheet, Dimensions, TouchableOpacity, Animated } from "react-native";


function AndroidPrompt(props,ref)
{
    const {anCancelPress} = props;
    const [_visible, _setVisible] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [hintText, setHintText] = React.useState('');
    const animValue = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
       if(ref) {
        ref.current = {
            setVisible: _setVisible,
            setHintText,
        };
       }
    }, [ref]);

    React.useEffect(() => {
        if(_visible) {
             setVisible(true);
             Animated.timing(animValue, {
                duration: 300,
                toValue: 1,
                useNativeDriver: true,
             }).start();
        } else{
            Animated.timing(animValue, {
                duration: 300,
                toValue: 0,
                useNativeDriver: true,
             }).start(() => {
                setVisible(false);
                setHintText('');
             });
        }
     }, [_visible , animValue]);

     const backdropAnimStyle = {
opacity: animValue,
     };

     const promptAnimationStyle = {
        transform: [
            {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [500, 0],
          }),  
        },
    ],
};
    return (
        <Modal visible = {visible} transparent={true}>
            <View style={style.content}>
                <Animated.View style={[style.backdrop, StyleSheet.absoluteFill, backdropAnimStyle]} />

                <Animated.View style ={[style.prompt, promptAnimationStyle]}>
                <Text style={style.hint}>{hintText || "Hello NFC"}</Text>
                <TouchableOpacity style={style.btn} onPress={() => {
                    _setVisible(false);
                    anCancelPress();
                }}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}
const style = StyleSheet.create({
    content: {
        flex: 1,
    },
    backdrop: {
        backgroundColor: 'rgbd(0,0,0,0.3)',
    },
    prompt: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        width: Dimensions.get('window').width -2*20,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 60,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    hint: {
        fontSize: 24,
        marginBottom: 20,
    },
    btn: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 15,
    },
});
export default React.forwardRef(AndroidPrompt);