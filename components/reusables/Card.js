import React from 'react'
import { View, StyleSheet } from 'react-native'

const Card = props => {
    return <View style={[styles.card, props.style]}>{props.children}</View>
}

const styles = StyleSheet.create({
    card: {
        //Shadow properties ONLY work on iOS...
        shadowColor: 'rgb(0,0,0)',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 6,
        shadowOpacity: .26,
        //...for android shadows you have to use the elevation property
        elevation: 5,
        backgroundColor: 'rgb(255,255,255)',
        padding: 20,
        borderRadius: 10
    },
})

export default Card
