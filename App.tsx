import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginSignup from './pages/LoginSignup';
import Home from './pages/Home';
import Navbar from './Navbar';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginSignup" component={LoginSignup} />
        <Stack.Screen name="Home" component={Navbar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
