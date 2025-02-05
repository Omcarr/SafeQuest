import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HistoryPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History Page (Coming Soon)</Text>
    </View>
  );
};

export default HistoryPage;

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
