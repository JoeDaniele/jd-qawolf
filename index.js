const express = require('express');
const hnRoutes = require('./routes/hn');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Route for Hacker News articles
app.use('/api', hnRoutes);

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
