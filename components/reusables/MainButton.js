import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native'

//TouchableNativeFeedback allows Android's native feedback of the ripple effect for touch (whatever that means, I didn't see any ripple). Anyway, if we want to use that for Android and TouchableOpacity for iOS we simply

import config from '../../config'

const MainButton = props => {
    let ButtonComponentType = TouchableOpacity //Making a variable and starting it with a capital character allows us to use it as a JSX element. This is a React feature, not specifically React Native. In any case we can set this JSX element equal to TouchableOpacity by default, the do a Platform.OS and Platform.Version check to make sure the OS would make use of the ripple and, if so, make that JSX element equal to TouchableNativeFeedback. 

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        ButtonComponentType = TouchableNativeFeedback
    }

    return (
        <ButtonComponentType style={props.stylingss} onPress={props.onPressingss} activeOpacity={.5}>
            <View style={styles.mainButton}>
                <Text style={styles.mainButtonText}>{props.children}</Text>
            </View>
        </ButtonComponentType>
    )
}

const styles = StyleSheet.create({
    mainButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: config.colors.mainRed,
        borderRadius: 35
    },
    mainButtonText: {
        color: 'rgb(255,255,255)',
        fontFamily: 'open-sans',
        fontSize: 18
    }
})

export default MainButton
