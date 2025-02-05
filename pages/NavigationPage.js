import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NavigationPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Navigation Page (Coming Soon)</Text>
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
