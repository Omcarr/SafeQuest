import React from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const FamilyLoc = () => {
  const mapHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Family Map</title>
        <script src="https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js"></script>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css" rel="stylesheet">
        <style>
            body { margin: 0; padding: 0; }
            #map { width: 100vw; height: 100vh; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            mapboxgl.accessToken = 'pk.eyJ1Ijoid2ViLWNvZGVncmFtbWVyIiwiYSI6ImNraHB2dXJvajFldTAzMm14Y2lveTB3a3cifQ.LfZtv0p9GUZCP7ZVuT33ow';
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-87.6298, 41.8781],
                zoom: 12
            });

            const places = [
                {"lat":41.8781,"lng":-87.6298,"color":"red"},
                {"lat":41.8827,"lng":-87.6233,"color":"blue"},
                {"lat":41.8917,"lng":-87.6055,"color":"green"},
                {"lat":41.8663,"lng":-87.6167,"color":"purple"},
                {"lat":41.8807,"lng":-87.6742,"color":"orange"}
            ];

            places.forEach(place => {
                new mapboxgl.Marker({ color: place.color })
                    .setLngLat([place.lng, place.lat])
                    .addTo(map);
            });
        </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView originWhitelist={['*']} source={{html: mapHtml}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FamilyLoc;
