import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CommunityPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Community Page (Coming Soon)</Text>
    </View>
  );
};

export default CommunityPage;

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
