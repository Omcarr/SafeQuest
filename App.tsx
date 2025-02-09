import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginSignup from './pages/LoginSignup';
import Navbar from './Navbar'; // Updated to use Navbar
import ProfilePage from './pages/ProfilePage';
import Intro from './Intro'; // Importing the animated intro screen
import Settings from './pages/Settings';
import TermsPrivacy from './pages/settings/TermsPrivacy';
import AboutSafeQuest from './pages/settings/AboutSafeQuest';
import Tutorial from './pages/Tutorial';
import SaheliScreen from './pages/SaheliScreen';
import { UserProvider } from './userContext';


const Stack = createNativeStackNavigator();

const App = () => {
  const [isIntroDone, setIntroDone] = useState(false);

  return (
    <UserProvider>
    <View style={{ flex: 1, backgroundColor: '#001F3F' }}>
      {/* Show Intro first, then load the app */}
      {!isIntroDone ? (
        <Intro onAnimationEnd={() => setIntroDone(true)} />
      ) : (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="Tutorial" component={Tutorial} /> */}
            {/* Uncomment below if you need LoginSignup */}
            {/* <Stack.Screen name="LoginSignup" component={LoginSignup} /> */}
            <Stack.Screen name="MainApp" component={Navbar} />
            <Stack.Screen name="My Profile" component={ProfilePage} />
            <Stack.Screen name="Settings" component={Settings} /> 
            <Stack.Screen name="TermsPrivacy" component={TermsPrivacy} />
            <Stack.Screen name="AboutSafeQuest" component={AboutSafeQuest} />
            <Stack.Screen name="SaheliScreen" component={SaheliScreen} />

          </Stack.Navigator>
        </NavigationContainer>
      )}
    </View>
    </UserProvider>
  );
};

export default App;
