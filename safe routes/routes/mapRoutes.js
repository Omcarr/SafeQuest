import { Router } from "express";
import axios from "axios";
import pool from "../config/db.js";
import { readFileSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;

// Load crime severity data
const crimeData = JSON.parse(
  readFileSync(join(process.cwd(), "data", "crimeData.json"))
);

// Function to calculate safety score
const calculateSafetyScore = async (route, userAge, userSex) => {
  let totalScore = 0;

  const routeCoordinates = route.geometry.coordinates;

  for (const [severity, crimes] of Object.entries(crimeData)) {
    const severityWeight = parseInt(severity, 10);

    for (const crime of crimes) {
      const { rows } = await pool.query(
        `SELECT COUNT(*) as count 
                 FROM crime_data 
                 WHERE crm_cd_desc = $1 
                   AND ABS(vict_age - $2) <= 5 
                   AND vict_sex = $3`,
        [crime, userAge, userSex]
      );

      totalScore += severityWeight * parseInt(rows[0].count, 10);
    }
  }

  return totalScore;
};

// Handle API request to return the safest route map
router.post("/safest-route", async (req, res) => {
  try {
    const { latA, lonA, latB, lonB, age, sex } = req.body;

    // Fetch route data from Mapbox Directions API
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${lonA},${latA};${lonB},${latB}?geometries=geojson&alternatives=true&access_token=${MAPBOX_API_KEY}`;
    const { data } = await axios.get(url);

    const routes = data.routes;
    const scores = [];

    for (const route of routes) {
      const score = await calculateSafetyScore(route, age, sex);
      scores.push({ route, score });
    }

    // Select the safest route
    const safestRoute = scores.sort((a, b) => a.score - b.score)[0];

    // Generate HTML response
    const routeGeoJSON = JSON.stringify(safestRoute.route.geometry);
    const html = `
        <!DOCTYPE html>
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
    mapboxgl.accessToken = '${MAPBOX_API_KEY}';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [${lonA}, ${latA}],
        zoom: 12,
    });

    map.on('load', () => {
        // Add the route source
        map.addSource('route', {
            type: 'geojson',
            data: ${routeGeoJSON}
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
        map.fitBounds(${JSON.stringify(
          safestRoute.route.geometry.coordinates.reduce((bounds, coord) => {
            bounds.push(coord);
            return bounds;
          }, [])
        )}, { padding: 20 });

        // Add markers for the start and end points
        const startMarker = new mapboxgl.Marker({ color: 'blue' })
            .setLngLat([${lonA}, ${latA}])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Start Point')) // Optional popup
            .addTo(map);

        const endMarker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([${lonB}, ${latB}])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('End Point')) // Optional popup
            .addTo(map);
    });
</script>
        </body>
        </html>
        `;

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error calculating the safest route");
  }
});

export default router;
