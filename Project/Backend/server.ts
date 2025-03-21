// server.js (Main server entry point)
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
connectDB();

const cors = require('cors');
app.use(cors());


app.use(express.json()); // Middleware for parsing JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));