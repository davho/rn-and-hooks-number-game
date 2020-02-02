import React from 'react'
import { Text, StyleSheet } from 'react-native'

//This BodyText component does nothing accept provide a wrapper for any props.children and apply the open-sans-regular font we require in and load asynchronously at the beginning of our App.js. There are two ways to pass the styles down to BodyText from wherever TitleText is used. You can place each of the style objects into an array as elements:  <Text style={[styles.titleText, props.style]}>{props.children}</Text>    which is the way I've always done it, or destructure each of the style objects into a new object, which is the way I'm demonstating in this component.

const BodyText = props => {
    return(
        <Text style={{...styles.bodyText, ...props.style}}>{props.children}</Text>
    )
}

const styles = StyleSheet.create({
    bodyText: {
        fontFamily: 'open-sans'
    }
})

export default BodyText
