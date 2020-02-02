import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, Alert, ScrollView, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons' //All icons here -- https://expo.github.io/vector-icons/

import { ScreenOrientation } from 'expo' //This is an AWESOME API that expo gives you that allows you to detect screen orientation changes and even lock screen rotation on particular screens even if you have "orientation": "default" in your app.json. https://docs.expo.io/versions/latest/sdk/screen-orientation/
//I tested this out below running ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) and release the lock on the GameOverScreen by running ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL)

import { NumberContainer, Card, MainButton, BodyText } from '../reusables'

import config from '../../config'

const generateRandomBetween = (min, max, exclude) => { //This function, generateRandomBetween, doesn't need access to state nor anything in the GameScreen component so we can just leave it here outside the component.
    min = Math.ceil(min)
    max = Math.floor(max)
    const rndNum = Math.floor(Math.random() * (max - min) + min)
    if (rndNum === exclude) { //In the rare event the random number equals the excluded value, the function simply calls itself again. This concept of calling a function inside of a function is called a recursion.
        return generateRandomBetween(min, max, exclude)
    } else {
        return rndNum
    }
}

const renderListItemForFlatList = (listLength, itemData) => { //Have to use a different function here for FlatList than for ScrollView because the renderItem prop of FlatList takes a function. The FlatList renderItem prop expects a function that doesn't necessarily need any arguments passed into it because the default argument is a new version of your array converted into an array objects that include the elements in your array plus an index prop. You reference this in the function that you set the renderItem prop to with the last argument and you can pass any other arguments you want to it by binding null as demonstrated in the FlatList further down this page. In renderListItemForFlatList we simply extract the index prop so that we can subtract it from the listLength arument we passed it when calling it using bind, and we extract the item prop to be used in our BodyText which, under the hood, is just a Text component with our fontFamily applied. You also have to use contentContainerStyle just as in ScrollView

    return  <View style={styles.listItem}>
                <BodyText>Guess #{listLength - itemData.index}</BodyText>
                <BodyText>----</BodyText>
                <BodyText>{itemData.item}</BodyText>
            </View>
        }

// const renderListItemForScrollView = (guess, numOfRound) => {
//     return  <View style={styles.listItem} key={guess}>
//                 <BodyText>Guess #{numOfRound}</BodyText>
//                 <BodyText>----</BodyText>
//                 <BodyText>{guess}</BodyText>
//             </View>
//         }

const GameScreen = props => {

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)

    const firstGuess = generateRandomBetween(1, 100, props.userNumber) //Apparently, the way useState works, even though firstGuess is set to a different number everytime, it will not mutate the first element in the array of our pastGuesses everytime GameScreen component renders.

    const [currentGuess, setCurrentGuess] = useState(firstGuess) //Initial state of currentGuess is whatever integer generateRandomBetween gives between 1 and 100 that is not === props.userNumber

    const [pastGuesses, setPastGuesses] = useState([firstGuess]) //Initial state of past guesses is whatever the first guess was

    //The useRef hook allows you to change a value without rerendering the component. You're using a reference instead of a state. useRef returns a mutable ref object whose .current property is initialized to the value passed to it. The returned object will persist for the full lifetime of the component and if changed will not cause a rerender.
    const lowBoundary = useRef(1) //Initialze the lowBoundary to 1
    const highBoundary = useRef(100) //Initialze the highBoundary to 100

    const { userNumber, gameOverHandler } = props //This object destructuring is just like the array destructing we're doing in our useStates. We're creating two consts, named userNumber and gameOverHandler respectively, which are appropriately the names of the two props we're passed. That simple. We could have equally specified props.userNumber and props.gameOverHandler when needing to access these as we do in the useEffect dependencies array.

    useEffect(() => { //useEffect takes a function that renders AFTER every render cycle of its component. It takes the place of componentDidUpdate, componentDidMount and componentWillUnmount for class based components: Its first argument is the function to run after each rerender, its second argument is an array of dependencies that dicate if that function should run. When any variable that is specified in that array changes, the useEffect function will run. If you simply pass an empty array to useEffect it behaves like componentDidMount.
        if (currentGuess === props.userNumber) { //When the computer guesses correctly we want to use props.gameOverHandler from App.js to pass it the length of the guesses array, which we use both to display the number of rounds it took the computer to guess the number, and to swap the GameScreen for the GameOverScreen.
        props.gameOverHandler(pastGuesses.length)
        }
    }, [currentGuess, userNumber, gameOverHandler]) //This useEffect hook should run when any of currentGuess, userNumber, or gameOverHandler change. You can actually have as many useEffects as you want in a component, the same as you can have as many useStates as you want.

    const nextGuessHandler = direction => {
        if ((direction === 'lower' && currentGuess < props.userNumber) || (direction === 'higher' && currentGuess > props.userNumber)) { //If user is lying to the computer that the number to be guessed is higher or lower than the number the computer just guessed we want to throw an alert from the Alert API
            Alert.alert('Don\'t lie!', 'You know that this is wrong.' [{text: 'Sorry!', style: 'cancel'}])
            return
        }
        if (direction === 'lower') { //If we say that the number the computer guessed is too big and a lower one should be guessed we know that the guessed number sets the highBoundary.
            highBoundary.current = currentGuess
        } else if (direction === 'higher') { //If we say that the number the computer guessed is too small and a higher one should be guessed we know that the guessed number sets the lowBoundary.
            lowBoundary.current = currentGuess + 1 //we have to add one here because our generateRandomBetween function, though it excludes the highBoundary, does not exclude the lowBoundary. This wouldn't be a fatal problem but so long as we're going to use our currentGuess as our key to pass to flatlist we need those all to be unique.
        }
        const nextNumber = generateRandomBetween(lowBoundary.current, highBoundary.current, currentGuess) //So now we simply call generateRandomBetween again and pass it those 2 updated references and pass the currentGuess as the exclude argument to get our next guess...
        setCurrentGuess(nextNumber) //...and pass our next guess to setCurrentGuess...
        setPastGuesses([nextNumber, ...pastGuesses]) //...and increase rounds by 1
    }

    return (
        <View style={styles.screen}>
            <Text>Opponent's Guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card style={styles.buttonContainer}>
                <MainButton onPressingss={() => nextGuessHandler('lower')}><Ionicons name={'md-remove'} size={24} color='rgb(255,255,255)'/></MainButton>
                <MainButton onPressingss={() => nextGuessHandler('higher')}><Ionicons name={'md-add'} size={24} color='rgb(255,255,255)'/></MainButton>
            </Card>

            { /*If you want to control the height and/or width of a ScrollView or FlatList then don't add the style to the list items and don't add the style to the ScrollView nor FlatList because of the way those two components work. Instead, wrap your ScrollView or FlatList in a View and style that.

            As for styling your ScrollView or FlatList directly, the style property doesn't allow you to style everything. If you want to apply flex settings you have to use the contentContainerStyle property.
            */ }
            <View style={styles.listContainer}>
                {/* Below we have a FlatList with the a keyExtractor plus the two essential props: data and renderItem. Data needs to be an array of objects and renderItem needs to be a function which takes only one argument and that argument is an object. FlatList expects an array of objects where at least one of the keys in the object is a key or an id with a string value which it can use to identify each object. If your data is not shaped this way you need to use the keyExtractor prop to explain to FlatList what in each of your objects can be used as the key, and that thing needs to be a string. In our case, we can use our item itself if we convert it from an integer to a string, as shown below. As for our renderItem prop, the first argument our function recieves is the one we set up in bind (we don't need to bind this, we can use null, and the second argument is the default argument which is our data.) */}
                <FlatList keyExtractor={item => item.toString()} data={pastGuesses} renderItem={renderListItemForFlatList.bind(null, pastGuesses.length)}></FlatList>
                {/* Below is just an example of how this would look as a ScrollView but I'd like to get into the habit of using FlatList
                    <ScrollView contentContainerStyle={styles.list}>
                    {pastGuesses.map((guess, count) => renderListItemForScrollView(guess, pastGuesses.length - count))}
                </ScrollView>*/}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: config.dimensions.windowHeight > 600 ? 20 : 10, //Essentially creating a breakpoint based on the height of the device
        width: 300,
        maxWidth: '80%'
    },
    listContainer: {
        flex: 1, /* For wrapping a ScrollView in a View, your ScrollView won't work on Android unless you give its parent view a flex of 1! On iOS it doesn't matter either way.  */
        width: config.dimensions.windowHeight > 600 ? '80%' : '90%', //Essentially creating a breakpoint based on the height of the device
    },
    list: {
        flexGrow: 1, //Like flex, flexGrow instructs the container to be able to take up as much space as it can, but unlike flex it says to keep the other behavior it gets from ScrollView or FlatList
    },
    listItem: {
        borderColor: 'rgb(128,128,128)',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 30,
        padding: 15,
        marginVertical: 10,
        backgroundColor: 'rgb(255,255,255)',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

export default GameScreen
