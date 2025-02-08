import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
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
  const fetchSafestRoute = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'http://localhost:3000/api/map/safest-route',
        {
          method: 'POST', // Use POST if sending data in the body
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jagah),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResponseData(data);
      console.log(responseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafestRoute();
  }, []);

  const [jagah, setJagah] = useState({
    latA: 37.7749,
    lonA: -122.4194,
    latB: 34.0522,
    lonB: -118.2437,
    age: 25,
    sex: 'M',
  });

  const [responseData, setResponseData] = useState(null); // Store API response
  const [error, setError] = useState(null); // Handle errors
  const [loading, setLoading] = useState(false); // Loading state
  return (
    <View style={{flex: 1}}>
      {loading && <ActivityIndicator size="large" color="blue" />}
      {error && (
        <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>
      )}

      {responseData ? (
        <WebView originWhitelist={['*']} source={{html: responseData}} />
      ) : (
        !loading && <Text style={{textAlign: 'center'}}>No Data Available</Text>
      )}
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
