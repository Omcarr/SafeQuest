import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FamilyPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Family Page (Coming Soon)</Text>
    </View>
  );
};

export default FamilyPage;

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
