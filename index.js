const express = require('express');
const connectDB = require('./src/config/db');
const draftRoutes = require('./src/routes/draftRoutes');

const app = express();

connectDB();

app.use(express.json());
app.use('/api', draftRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Draft Saver Service is running on port ${process.env.PORT}`);
});
