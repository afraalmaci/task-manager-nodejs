require('dotenv').config();
const app = require('./app');
const { connectDB, sequelize } = require('./config/db');

connectDB();

const PORT = process.env.PORT || 5000;

// Sync Sequelize models
sequelize.sync({ alter: true }).then(() => {
  console.log('All models have been synchronized.');
  app.listen(PORT, () => console.log(`The server is running on port ${PORT}.`));
});