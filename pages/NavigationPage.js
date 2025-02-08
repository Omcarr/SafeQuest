import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FloatingButton from '../components/FloatingButton'; // Import the floating button

const NavigationPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Navigation Page (Coming Soon)</Text>

      {/* Floating Button for Saheli */}
      <FloatingButton />
    </View>
  );
};

export default NavigationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
