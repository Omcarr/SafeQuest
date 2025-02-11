import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useUser} from '../userContext';
import FloatingButton from '../components/FloatingButton';

const MAPBOX_API_KEY =
  'pk.eyJ1Ijoid2ViLWNvZGVncmFtbWVyIiwiYSI6ImNraHB2dXJvajFldTAzMm14Y2lveTB3a3cifQ.LfZtv0p9GUZCP7ZVuT33ow';

const NavigationPage = () => {
  const {userData} = useUser();
  const user = userData;
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [mapsHTML, setMapsHTML] = useState(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Safest Route</title>
            <script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"></script>
            <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
            <style>
                body { margin: 0; padding: 0; }
                #map { width: 100%; height: 100vh; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2ViLWNvZGVncmFtbWVyIiwiYSI6ImNraHB2dXJvajFldTAzMm14Y2lveTB3a3cifQ.LfZtv0p9GUZCP7ZVuT33ow';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-87.73318, 41.885887],
        zoom: 12,
    });

    map.on('load', () => {
        // Add the route source
        map.addSource('route', {
            type: 'geojson',
            data: {"coordinates":[[-87.733176,41.885889],[-87.720917,41.885208],[-87.72037,41.873515],[-87.719121,41.873525],[-87.650308,41.875329],[-87.648052,41.875215],[-87.644998,41.850609],[-87.634652,41.845323],[-87.624621,41.72052],[-87.621065,41.713653],[-87.599607,41.713049],[-87.592384,41.707446],[-87.601728,41.676933],[-87.578746,41.646182],[-87.583695,41.589675],[-87.583626,41.583068],[-87.577821,41.511711],[-87.581694,41.506296],[-87.641108,41.506152],[-87.640565,41.502469]],"type":"LineString"}
        });

        // Add the route layer
        map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#1DB954', 'line-width': 5 },
        });

        // Fit the map to the route bounds
        map.fitBounds([[-87.733176,41.885889],[-87.720917,41.885208],[-87.72037,41.873515],[-87.719121,41.873525],[-87.650308,41.875329],[-87.648052,41.875215],[-87.644998,41.850609],[-87.634652,41.845323],[-87.624621,41.72052],[-87.621065,41.713653],[-87.599607,41.713049],[-87.592384,41.707446],[-87.601728,41.676933],[-87.578746,41.646182],[-87.583695,41.589675],[-87.583626,41.583068],[-87.577821,41.511711],[-87.581694,41.506296],[-87.641108,41.506152],[-87.640565,41.502469]], { padding: 20 });

        // Add markers for the start and end points
        const startMarker = new mapboxgl.Marker({ color: 'blue' })
            .setLngLat([-87.73318, 41.885887])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Start Point')) // Optional popup
            .addTo(map);

        const endMarker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([-87.640564, 41.50247])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('End Point')) // Optional popup
            .addTo(map);
    });
</script>
        </body>
        </html>`);
  const [loading, setLoading] = useState(false);
  const [satisfaction, setSatisfaction] = useState(null);
  const [activeInput, setActiveInput] = useState(null); // NEW STATE FOR ACTIVE INPUT FIELD

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
        'http://192.168.14.170:3000/api/map/safest-route',
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
      console.log(data);
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
      {/* Source Input Field */}
      <View style={styles.inputContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/149/149059.png',
          }}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your location"
          placeholderTextColor="#000"
          value={source}
          onChangeText={text => {
            setSource(text);
            setActiveInput('source'); // Set active field
            fetchSuggestions(text, setSourceSuggestions);
          }}
          onFocus={() => setActiveInput('source')} // When clicked, set it active
        />
      </View>

      {/* Destination Input Field */}
      <View style={styles.inputContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/2776/2776067.png',
          }}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter destination location"
          placeholderTextColor="#000"
          value={destination}
          onChangeText={text => {
            setDestination(text);
            setActiveInput('destination'); // Set active field
            fetchSuggestions(text, setDestinationSuggestions);
          }}
          onFocus={() => setActiveInput('destination')} // When clicked, set it active
        />
      </View>

      {/* Show suggestions only for active input field */}
      {activeInput === 'source' && sourceSuggestions.length > 0 && (
        <FlatList
          data={sourceSuggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.suggestion}
              onPress={() => {
                setSource(item);
                setSourceSuggestions([]);
              }}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {activeInput === 'destination' && destinationSuggestions.length > 0 && (
        <FlatList
          data={destinationSuggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.suggestion}
              onPress={() => {
                setDestination(item);
                setDestinationSuggestions([]);
              }}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Find Directions Button */}
      <TouchableOpacity style={styles.button}>
        {/* <TouchableOpacity style={styles.button} onPress={handleFindDirections}> */}
        <Text style={styles.buttonText}>Find Directions</Text>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{marginTop: 20}}
        />
      )}

      {/* Map Display - Full Screen Below Button */}
      {mapsHTML ? (
        <View style={styles.mapContainer}>
          <WebView
            originWhitelist={['*']}
            source={{html: mapsHTML}}
            style={styles.webView}
          />

          {/* Are You Satisfied Section */}
          <View style={styles.satisfactionContainer}>
            {/* Row with text and buttons */}
            <View style={styles.satisfactionRow}>
              <Text style={styles.satisfactionText}>Are you satisfied?</Text>
              <View style={styles.satisfactionButtons}>
                <TouchableOpacity
                  style={styles.satisfactionButtonYes}
                  onPress={() => setSatisfaction('positive')}>
                  <Text style={styles.satisfactionButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.satisfactionButtonNo}
                  onPress={() => setSatisfaction('negative')}>
                  <Text style={styles.satisfactionButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Positive feedback appears below */}
            {satisfaction === 'positive' && (
              <Text style={styles.positiveFeedback}>
                Great! Glad this helped. 😊
              </Text>
            )}
          </View>
        </View>
      ) : null}
      <FloatingButton />
    </View>
  );
};

// **STYLING**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0ec',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#555',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1, // Takes full available space
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },
  satisfactionContainer: {
    marginTop: 8,
    width: '100%',
    paddingHorizontal: 10,
  },
  satisfactionRow: {
    flexDirection: 'row', // Keep "Are you satisfied?" & buttons in a row
    alignItems: 'center',
    justifyContent: 'space-between', // Space out text and buttons
  },
  satisfactionText: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  satisfactionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  satisfactionButtonYes: {
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#abf7b1',
    borderRadius: 4,
  },
  satisfactionButtonNo: {
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFC0CB',
    borderRadius: 4,
  },
  satisfactionButtonText: {
    fontSize: 12,
  },
  positiveFeedback: {
    marginTop: 5, // Add space below Yes/No buttons
    color: 'green',
    fontSize: 13,
    textAlign: 'center', // Center align for better UI
  },
});

export default NavigationPage;
