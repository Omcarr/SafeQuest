import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Button} from 'react-native';
import {WebView} from 'react-native-webview';

const NavigationPage = () => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSafestRoute = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'http://localhost:3000/api/map/safest-route',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latA: 37.7749,
            lonA: -122.4194,
            latB: 34.0522,
            lonB: -118.2437,
            age: 25,
            sex: 'M',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text(); // Ensure it's plain HTML
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

  return (
    <View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button
          title="Click Me"
          onPress={() => Alert.alert('Button Clicked!')}
        />
      </View>
      <View style={{flex: 1}}>
        {loading && <ActivityIndicator size="large" color="blue" />}
        {error && <Text style={styles.error}>{error}</Text>}

        {responseData ? (
          <WebView originWhitelist={['*']} source={{html: responseData}} />
        ) : (
          !loading && <Text style={styles.noData}>No Data Available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NavigationPage;
