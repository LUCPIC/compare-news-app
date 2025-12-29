require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
