const express = require('express');
const cors = require('cors');
require('dotenv').config();
const apiRoutes = require('./index');

const backendUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:8000';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000', // Allow requests from frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
// Add backend URL to locals for use in routes or middleware
app.use((req, res, next) => {
    res.locals.backendUrl = backendUrl;
    next();
});
// Routes
app.use('/api', apiRoutes);
// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
