const express = require('express');

const app = express();

const downRoutes = require('./routes/downRoutes');

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api', downRoutes);

app.get('*', (rec, res) => res.send('HELLO world my1'));

app.use((req, res, next) => {
  console.log('Hello from the middleware ');
  next();
});

module.exports = app;
