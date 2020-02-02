import React from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'

import { ScreenOrientation } from 'expo' //This is an AWESOME API that expo gives you that allows you to detect screen orientation changes and even lock screen rotation on particular screens even if you have "orientation": "default" in your app.json. https://docs.expo.io/versions/latest/sdk/screen-orientation/
//I tested this out below running  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) on StartGameScreen and then ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL) here in this component. This will come in handy if I need to force a landscape view for spreadsheets or something on some particular screens but need to force portrait or allow both orientations on other screens.

import { BodyText, TitleText, MainButton } from '../reusables'

import config from '../../config'

//If you're using the Image component, you always use the source prop and the require syntax. React Native will automatically make your image's height equal to its parent element, so if that's something like our View here which has a style of styles.screen which is set to flex 1 our image will be the height of the device on which it's loaded. If it's a local image, you don't have to set a width and height in order to get the image to load but for images coming from the web you must do this in order to get them to load. You also set the source prop to an object containing a uri key which is set to a string of the url. If you're downloading an image and it's not already cached there's a fadeDuration prop automatically applied which fades the image in after it's loaded but you can control the time in which it takes for the image to fade in by setting the fadeDuration prop.

//If aspect ratio set forth in the style you apply to your image is not the same as the image's aspect ratio, and of course in most cases it won't be, for the resizeMode prop you can choose center, contain, cover, repeat or stretch. Cover is the default but I went ahead and put it in here anyway just to include the prop.

//Styles are not passed down through the component tree because we're not using CSS. The only exeption to this is if we have a Text component wrapped in another Text component, in which case all styles are passed down just like in CSS. Also note that even though flexBox is the default display for View components it's not for Text components. Text automatically wraps itself onto a new line if it doesn't fit into one line. If you don't want Text to wrap set the numberOfLines prop, maybe combined with ellipsizeMode, to truncate intead of wrap.

//I made the custom MainButton component take a prop called onPressingss and a prop called stylingss just to show that it doen't matter what we call the props, they are our custom props and we can call them anything. The children of the custom component can also be anything that makes sense so in here they are just the text New Game because where we use props.children in our MainButton prop is within a Text component.

const GameOverScreen = props => {

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL)

    return ( //Wrapping this in a ScrollView as an after thought in the event that a device MIGHT not have enough height to display everything. Originally was just such a precautionary measure but now that I've changed "orientation": "default" in app.json I'm doing it so that I can access everything while the screen is horizontal.
        <ScrollView>
            <View style={styles.screen}>
                <TitleText style={styles.gameOverText}>GAME OVER</TitleText>
                <Image
                    source={require('../../assets/success.png')}
                    style={styles.image}
                    resizeMode='cover'
                    fadeDuration={1000}/>
                <BodyText style={styles.gameOverDetails}>The number was: <Text style={styles.highLight}>{props.userNumber}</Text> and it took your phone <Text style={styles.highLight}>{props.guessRounds}</Text> rounds to guess it.</BodyText>
                <MainButton stylingss={styles.button} onPressingss={props.startNewGameHandler}>New Game</MainButton>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: config.dimensions.windowWidth * .75,
        height: config.dimensions.windowWidth * .75,
        borderRadius: config.dimensions.windowWidth * .75 / 2, //Border radius should be exactly half for circles otherwise you can get jagged edges on Android
        borderColor: 'rgb(0,0,0)',
        borderWidth: 3,
        marginVertical: 30
    },
    gameOverText: {
        fontSize: config.dimensions.windowHeight > 600 ? 20 : 16, //Essentially creating a breakpoint based on the height of the device
    },
    gameOverDetails: {
        textAlign: 'center',
        marginHorizontal: 20,
        fontSize: config.dimensions.windowHeight > 600 ? 18 : 14 //Essentially creating a breakpoint based on the height of the device
    },
    highLight: {
        color: config.colors.mainRed,
        fontFamily: 'open-sans-bold'
    },
    button: {
        margin: 15
    }
})

export default GameOverScreen
