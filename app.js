const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
const authRoutes = require('./authRoutes');
const apiRoutes = require('./apiRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Authentication routes
app.use('/auth', authRoutes);

// Protected CRUD API routes
app.use('/api', authenticateToken, apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message || err);
  res.status(err.status || 500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
