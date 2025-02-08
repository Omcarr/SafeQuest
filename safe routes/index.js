import express from 'express';
import bodyParser from 'body-parser';
import mapRoutes from './routes/mapRoutes.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json()); // Parses JSON request bodies

// Routes
app.use('/api/map', mapRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
