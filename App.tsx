import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginSignup from './pages/LoginSignup';
import Navbar from './Navbar'; // Updated to use Navbar

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* First screen: Login / Signup */}
        <Stack.Screen name="LoginSignup" component={LoginSignup} />

        {/* After login/signup, navigate to MainApp (which contains the navbar tabs) */}
        <Stack.Screen name="MainApp" component={Navbar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
