import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Font from 'expo-font' //This package should be included in Expo by default but you can run expo install expo-font to be sure
import { AppLoading } from 'expo' //This package will allow you to prolong a task until another task is done. Must be used in order to load fonts in expo, which need to be loaded with loadAsync() and don't forget to import this with the {} other wise you'll get an Invariant Violation error

//Check these out UI libraries out for some great prestyled, fully responsive cross-platform components -- https://docs.expo.io/versions/latest/guides/userinterface/
//FOR DATA TABLES: https://callstack.github.io/react-native-paper/data-table.html

import { StartGameScreen, GameScreen, GameOverScreen } from './components/screens'

import { Header } from './components/views'


const fetchFonts = () => { //Creating this fetchFonts function outside the component because it doesn't need to run with every component rerender cycle. Within fetchFonts we're simply passing an object of fonts, where the keys are the names we want to call the fonts and the values are the fonts' relative paths in our project, to loadAsync and running it on the Font package that we import at the top. The method loadAsync returns a promise, so we return the promise from calling fetchFonts so we can it later from our component and wait for the promise to resolve before we continue. The way to do that is to use the AppLoading package from Expo.
    return Font.loadAsync({
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
        'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
    })
}

//Goal of building things that are future proof: I'm more than accustomed to building complex stateful components with React Classes but want to start building stateful functional components with hooks to make my code future proof.

export default function App() {

    const [userNumber, setUserNumber] = useState()
    const [guessRounds, setGuessRounds] = useState(0)
    const [dataLoaded, setDataLoaded] = useState(false)

    if (!dataLoaded) { //If dataLoaded is still false return <AppLoading/> instead of our <App/> because we're still waiting on the prerequisite data. AppLoading takes a startAsync prop and an onFinish prop. The startAsync props allows us to point to the operation we want to start when AppLoading is first rendered and that, in our case, is our fetchFonts function. The operation it calls must return a promise, as our fetchFonts does, so that AppLoading can listen for the promise to resolve and call whatever you pass to onFinish. The onFinish prop calls a function only when the function passed to startAsync resolves. We also have an onError prop that we can use to display some type of error to the user or simply log something to the console. Now that our fonts are loaded we can simply use them anywhere in our project using fontFamily.
        return <AppLoading startAsync={fetchFonts} onFinish={() => setDataLoaded(true)} onError={err => console.log(err)}/>
    }

    const startNewGameHandler = () => { //When the startNewGameHandler runs it simply resets setGuessRounds back to 0 and setUserNumber back to null
        setGuessRounds(0)
        setUserNumber(null) //This is the same as useState() with empty parentheses
    }

    const startGameHandler = selectedNumber => { //When the startGameHandler runs it sets the userNumber to whichever number was selected from the StartGameScreen and sets guessRounds to 0.
        setUserNumber(selectedNumber)
        setGuessRounds(0)
    }

    const gameOverHandler = numOfRounds => { //The gameOverHandler is passed to the GameScreen so that when the game finishes and the gameOverHandler runs it sets guessRounds to the number of rounds passed to it, which can then be printed to the GameOverScreen
        setGuessRounds(numOfRounds)
    }

    let content = <StartGameScreen startGameHandler={startGameHandler}/> //A let called content is initially set to the StartGameScreen component with the startNewGameHandler passed to it, which is then used by this screen in the button which starts the game. This actually happens after the user has confirmed the first number and appears in an instance of our card component that appears only when hasUserConfirmed is set from false to true.

    if (userNumber && guessRounds === 0) { //if userNumber is truthy (it exists as not undefined or null) and guessRounds is not 0 we update the let called content to the GameScreen, which we pass the userChoice and the gameOverHandler. Else, if userNumber is not truthy and guessRounds > 0 we update the let called content to the GameOverScreen
        content = <GameScreen userNumber={userNumber} gameOverHandler={gameOverHandler}/>
    } else if (guessRounds > 0) {
        content = <GameOverScreen userNumber={userNumber} guessRounds={guessRounds} startNewGameHandler={startNewGameHandler}/>
    }
    //Then we return our dummy Header, of course, and our let called content, which will show whichever screen we need.
    return (
        <View style={styles.screen}>
            <Header title='Guess a number'/>
            {content}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1 //Make it take up the entire capacity of its parent, which is technically the body. (Could put any number here since it's the only 'element' which is a direct descendant of the body.)
    }
})
