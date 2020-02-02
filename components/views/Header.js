import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import config from '../../config'

import { TitleText } from '../reusables'

const Header = props => {
    return (
        <View style={{...styles.header}}>
            <TitleText style={styles.headerTitle}>{props.title}</TitleText>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 90,
        paddingTop: 36,
        backgroundColor: config.colors.mainRed,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        color: 'rgb(0,0,0)',
        fontSize: 24
    }
})

export default Header
