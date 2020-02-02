import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import config from '../../config'

const NumberContainer = props => {

    return(
        <View style={styles.container}>
            <Text style={styles.number}>{props.children}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: config.colors.mainRed,
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    number: {
        color: config.colors.mainRed,
        fontSize: 22
    }
})

export default NumberContainer
