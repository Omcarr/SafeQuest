import { Router } from "express";
import axios from "axios"; // Import axios for API requests
import pool from "../config/db.js";

const router = Router();

// Replace with your actual Mapbox API key
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;

router.post("/", async (req, res) => {
  try {
    const { vict_age, vict_sex, location, crm_cd_desc } = req.body;

    // Validate required fields
    if (!vict_age || !vict_sex || !location || !crm_cd_desc) {
      return res.status(400).json({ error: "Required fields: vict_age, vict_sex, location, crm_cd_desc" });
    }

    // Fetch latitude and longitude from Mapbox Geocoding API
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_API_KEY}`;
    const geocodeResponse = await axios.get(geocodeUrl);

    if (!geocodeResponse.data.features.length) {
      return res.status(400).json({ error: "Unable to fetch coordinates for the provided location" });
    }

    const [lon, lat] = geocodeResponse.data.features[0].center;

    // Insert new crime report into the database
    const { rows } = await pool.query(
      `INSERT INTO crime_data (vict_age, vict_sex, location, crm_cd_desc, lat, lon)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [vict_age, vict_sex, location, crm_cd_desc, lat, lon]
    );

    res.status(201).json({ message: "Incident reported successfully", data: rows[0] });
  } catch (error) {
    console.error("Error reporting incident:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
