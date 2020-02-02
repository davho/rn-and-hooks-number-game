import { Dimensions, Platform } from 'react-native'

export default {
    colors: {
        mainRed: Platform.OS === 'ios' ? 'rgb(247,40,123)' : 'rgb(247,30,60)', //This is just an example of how to use the built in Platform API. The carrier locked Tracfone android phone I got doesn't display colors like my iPHone (I'm pretty sure this has everything to do with the inexpensive device and not the operating system) but for my A-B testing running this app on both phones concurrently I just wanted to demo how the Platform API of React Native works. Usually you'd use this to conditionally do something with a component or API that already adjusts according to which platform you're running on, like the Button component (which I don't like to use for that reason). I found that the pan responder API also behaves differently on each platform because it makes use of native gestures so coming across reasons to use the Platform API in some of those cases would also make sense. 
        mainPurp: 'rgb(199,23,252)'
    },
    dimensions: { //Screen and Window are supposed to be different on Android but the console. logs I'm getting are showing otherwise. IMPORTANT: These values are calculated only once per app lifecycle, so if you were to load the device while it was being held horizontally you'd width and height would switch places and would wreck anything you have calculated according to these dimensions in your app.
        windowWidth: Dimensions.get('window').width,
        windowHeight: Dimensions.get('window').height,
        screenWidth: Dimensions.get('screen').width,
        screenHeight: Dimensions.get('screen').height,
    }
}
