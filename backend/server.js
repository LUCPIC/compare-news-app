const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const paymentRoutes = require('./routes/payments');
const externalNewsRoutes = require('./routes/external-news');

app.get('/', (req, res) => {
  res.send('Hello from the COMPARE app backend!');
});

app.use('/auth', authRoutes);
app.use('/news', newsRoutes);
app.use('/payments', paymentRoutes);
app.use('/external-news', externalNewsRoutes);

module.exports = app;
