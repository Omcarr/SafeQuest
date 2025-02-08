import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FloatingButton from '../components/FloatingButton'; // Import the floating button
import {WebView} from 'react-native-webview';

// const NavigationPage = () => {
//   return (
//     <View>
//       <View style={styles.container}>
//         <Text style={styles.text}>Navigation Page (Coming Soon)</Text>

//         {/* Floating Button for Saheli */}
//         <FloatingButton />
//       </View>
//       <View style={styles.container}>
//         <WebView source={{uri: 'https://godfather979.github.io/frontend/'}} />
//       </View>
//     </View>
//   );
// };

const NavigationPage = () => {
  return (
    <View style={styles.container}>
      <WebView source={{uri: 'https://godfather979.github.io/frontend/'}} />
      <FloatingButton />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default NavigationPage;
