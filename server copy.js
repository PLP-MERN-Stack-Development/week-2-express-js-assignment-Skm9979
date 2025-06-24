require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products');
const { loggerMiddleware } = require('./middleware/logger');
const { errorHandler } = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/products', productRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


