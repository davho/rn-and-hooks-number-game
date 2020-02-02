import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import config from '../../config'

const MainButton = props => {

    return (
        <TouchableOpacity style={props.stylingss} onPress={props.onPressingss} activeOpacity={.5}>
            <View style={styles.mainButton}>
                <Text style={styles.mainButtonText}>{props.children}</Text>
            </View>
        </TouchableOpacity>
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
