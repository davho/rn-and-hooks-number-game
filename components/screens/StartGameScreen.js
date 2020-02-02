import React, { useState } from 'react'
import { View, Text, StyleSheet, Button, Keyboard, Alert, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView } from 'react-native'

import { Input, Card, NumberContainer, TitleText } from '../reusables'

import config from '../../config'

// blurOnSubmit closes the keyboard but only for Android so we have to do something else for iOS. We have to use a TouchableWithoutFeedback and use its onPress handler to call Keyboard.dismiss(). They Keyboard API is one provided to us by React Native.

const StartGameScreen = props => {

    const [enteredValue, setEnteredValue] = useState('') //This hook updates the number input field
    const [hasUserConfirmed, setHasUserConfirmed] = useState(false) //This hook sets hasUserConfirmed, which we need to either display or not the card that allows us to start the game
    const [selectedNumber, setSelectedNumber] = useState('') //This hook sets the number that is currently in the input field to hasUserConfirmed

    const numberInputHandler = inputText => { //This numberInputHandler simply validates the number with a regex before passing it into setEnteredValue so that as you type you can't enter in anything except characters 0-9, which is kind of redundant since the only keyboard we make available to the input is 'number-pad'

        setEnteredValue(inputText.replace(/[^0-9]/g,''))
    }

    const resetInputHandler = () => { //This resetInputHandler simply resets the hooks above to their original states and is passed to the reset button below
        setEnteredValue('')
        setHasUserConfirmed(false)
    }

    const hasUserConfirmedHandler = () => { //This hasUserConfirmed handler takes the current state of enteredValue, parses it from string to integer, then checks to make sure that it's a number between 1 and 99. If it's not an alert pops up that the number entered was invalid (we should never see this because we've already made it impossible to enter anything else besides a number between 1 and 99)...
        const chosenNumber = parseInt(enteredValue)
        if (isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > 99) {

            Alert.alert('Invalid number! Number has to be between 1 and 99.')
            return
        }
        //...then sets hasUserConfirmed to true, sets selectedNumber to the enteredValue as an actual integer now, and sets enteredValue back to an empty string, then calls the dismiss() method on the Keyboard API, which we really only need for iOS because for Android it automatically dismisses with the blurOnSubmit property on TextInputs
        setHasUserConfirmed(true)
        setSelectedNumber(chosenNumber)
        setEnteredValue('')
        Keyboard.dismiss()
    }

    let confirmedOutput //Declare confirmedOutput as a let...

    if (hasUserConfirmed) { //...if hasUserConfirmed is true, assign some JSX to the let. The JSX is our custom Card component with its props.children as the JSX we write between it, which includes a Text component, our custom NumberContainer component with our selectedNumber passed in as its props.children and a button with our props.startGameHandler coming from App.js. Now confirmedOutput is toward the bottom of this StartGameScreen's JSX and will display if hasUserConfirmed is true and won't if confirmedOutput false. Note: this.props.children is used to display whatever you include between the opening and closing tags when invoking a component -- https://codeburst.io/a-quick-intro-to-reacts-props-children-cb3d2fce4891
        confirmedOutput = (
            <Card style={styles.chosenNumberCard}>
                <Text>You Selected:</Text>
                <NumberContainer>{selectedNumber}</NumberContainer>
                <Button title='Start Game' onPress={() => props.startGameHandler(selectedNumber)}/>
            </Card>
        )
    }

    return ( //Wrapped the entire component in a ScrollView after switching to "orientation": "default" in app.json so that when the phone is horizontal nothing gets cut off. Also, then wrapped the rest of the component in a KeyboardAvoidingView setting behavior to 'position' and keyboardVerticalOffset to 10, which dicatates that the contents of the component should move upwward 10px when the keyboard is in view. You can also set behavior to 'padding' so that a padding gets added to the bottom to slide everything up, and last but not least you can set it to height. Typically on iOS 'position' works best and on Android 'padding' works best. I believe that on some Android devices (not necessarily some android versions?) opening the keyboard opens up a default blank screen that allows you to type freely until you hit "done" after which what you typed is populated in the field you were trying to type in.
        <ScrollView>
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={90}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.screen}>
                        <TitleText style={styles.title}>Start a New Game!</TitleText>
                        <Card style={styles.card}>
                            <Text style={styles.title}>Select a Number</Text>

                            <Input
                                style={styles.inputField}
                                onChangeText={numberInputHandler}
                                value={enteredValue}
                                blurOnSubmit
                                autoCapitalize='none'
                                autoCorrect={false}
                                keyboardType='number-pad'
                                maxLength={2} />

                            <View style={styles.buttonContainer}>
                                <View style={styles.button} >
                                    <Button
                                        color={config.colors.mainRed}
                                        title='Reset'
                                        onPress={resetInputHandler}/>
                                </View>
                                <View style={styles.button} >
                                    <Button
                                        color={config.colors.mainPurp}
                                        title='Confirm'
                                        onPress={hasUserConfirmedHandler}/>
                                </View>
                            </View>
                        </Card>

                            {confirmedOutput}

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    title: {
        fontSize: 20,
        marginVertical: 10
    },
    card: {
        width: '80%',
        minWidth: 300, //Setting a minWidth of 300 and an otherwise width of 80% is good practice to making sure that things render well on these unusual widthed phones (the min for which I belive the widths are 320)
        maxWidth: '95%', //Setting a maxWidth of 95% ensures that the card never bleeds outside the phone.
        alignItems: 'center'
    },
    inputField: {
        width: 160,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    button:  {
        width: config.dimensions.windowWidth / 4, //Note that if you have "orientation": "default" in your app.json and the app loads while the device is horizontal you're going to get "opposite" values for width and height. The way to account for this is simply to calculate dimensions within the component, put an event listener on Dimensions.addEventListener('change', someFunction) and make the function something that updates a hook with that dimension's value. Then just set the style properties that depend on those values inline. So you'd set up 2 hooks, one for width and one for height, i.e. [availableDeviceHeight, setAvailableDeviceHeight] and [availableDeviceWidth, setAvailableDeviceWidth]. You should also use useEffect to clean up the event listener each time there's a change to dimensions so that you don't have numerous event listeners running. There may also be a way to export this to a non visual component instead of creating this functionality each time for each component.
        backgroundColor: 'rgb(200,200,200)',
        borderRadius: 20
    },
    chosenNumberCard: {
        marginTop: 20,
        alignItems: 'center'
    }
})

export default StartGameScreen
