import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useUser} from '../userContext';

const MAPBOX_API_KEY =
  'pk.eyJ1Ijoid2ViLWNvZGVncmFtbWVyIiwiYSI6ImNraHB2dXJvajFldTAzMm14Y2lveTB3a3cifQ.LfZtv0p9GUZCP7ZVuT33ow';

const NavigationPage = () => {
  const {userData} = useUser();
  const user = userData;
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [mapsHTML, setMapsHTML] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) return;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query,
    )}.json?access_token=${MAPBOX_API_KEY}&autocomplete=true&limit=5`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.features.map(feature => feature.place_name));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchLatLong = async location => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location,
    )}.json?access_token=${MAPBOX_API_KEY}&limit=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates;
        return {latitude: coordinates[1], longitude: coordinates[0]};
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const fetchSafestRoute = async (latA, lonA, latB, lonB) => {
    setLoading(true);
    try {
      const response = await fetch(
        'http://10.10.10.248:3000/api/map/safest-route',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            latA,
            lonA,
            latB,
            lonB,
            age: 25,
            sex: 'M',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();
      setMapsHTML(data);
    } catch (error) {
      console.error('Error fetching route:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFindDirections = async () => {
    if (!source || !destination) {
      alert('Please enter both source and destination.');
      return;
    }

    try {
      const sourceCoords = await fetchLatLong(source);
      const destinationCoords = await fetchLatLong(destination);

      if (!sourceCoords || !destinationCoords) {
        alert('Could not fetch coordinates. Try again.');
        return;
      }

      fetchSafestRoute(
        sourceCoords.latitude,
        sourceCoords.longitude,
        destinationCoords.latitude,
        destinationCoords.longitude,
      );
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter source location"
        value={source}
        onChangeText={text => {
          setSource(text);
          fetchSuggestions(text, setSourceSuggestions);
        }}
      />
      <FlatList
        data={sourceSuggestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setSource(item);
              setSourceSuggestions([]);
            }}>
            <Text style={styles.suggestion}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter destination location"
        value={destination}
        onChangeText={text => {
          setDestination(text);
          fetchSuggestions(text, setDestinationSuggestions);
        }}
      />
      <FlatList
        data={destinationSuggestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setDestination(item);
              setDestinationSuggestions([]);
            }}>
            <Text style={styles.suggestion}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleFindDirections}>
        <Text style={styles.buttonText}>Find Directions</Text>
      </TouchableOpacity>

      {/* Show loading spinner while fetching map */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{marginTop: 20}}
        />
      )}

      {/* Render HTML response inside WebView */}
      {mapsHTML ? (
        <View style={styles.webViewContainer}>
          <WebView
            originWhitelist={['*']}
            source={{html: mapsHTML}}
            style={styles.webView}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  webViewContainer: {
    flex: 1,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },
});

export default NavigationPage;
