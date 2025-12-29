const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');

const paymentRoutes = require('./routes/payments');

app.get('/', (req, res) => {
  res.send('Hello from the COMPARE app backend!');
});

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
