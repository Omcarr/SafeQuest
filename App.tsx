import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navbar from './Navbar'; // Navbar is now global

const App = () => {
  return (
    <NavigationContainer>
      <Navbar />
    </NavigationContainer>
  );
};

export default App;
