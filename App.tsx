import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginSignup from './pages/LoginSignup';
import Navbar from './Navbar'; // Updated to use Navbar
import ProfilePage from './pages/ProfilePage';
import Intro from './Intro'; // Importing the animated intro screen

const Stack = createNativeStackNavigator();

const App = () => {
  const [isIntroDone, setIntroDone] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#001F3F' }}>
      {/* Show Intro first, then load the app */}
      {!isIntroDone ? (
        <Intro onAnimationEnd={() => setIntroDone(true)} />
      ) : (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Uncomment below if you need LoginSignup */}
            {/* <Stack.Screen name="LoginSignup" component={LoginSignup} /> */}
            <Stack.Screen name="MainApp" component={Navbar} />
            <Stack.Screen name="My Profile" component={ProfilePage} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
};

export default App;
