import React, { useState } from 'react'
import { View, Text, StyleSheet, Button, Keyboard, Alert, TouchableWithoutFeedback } from 'react-native'

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

    return (
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
        width: 300,
        maxWidth: '80%',
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
        width: 90,
        backgroundColor: 'rgb(200,200,200)',
        borderRadius: 20
    },
    chosenNumberCard: {
        marginTop: 20,
        alignItems: 'center'
    }
})

export default StartGameScreen
