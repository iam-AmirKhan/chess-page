const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const purchaseRoutes = require('./routes/purchaseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', purchaseRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error (check your .env MONGO_URI string!):', err.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
