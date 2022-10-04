/* eslint-disable no-console */
require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const loadRoutes = require('./routes/load');
const usersRoutes = require('./routes/users');
const requestsRoutes = require('./routes/requests');
const connection = require('./models/connection');
const updateReleaseDate = require('./services/updateReleaseDate');

connection.connectToServer(async (err) => {
  if (err) console.error('err : ', err);
  else {
    app.use(express.json());
    app.use(
      express.urlencoded({
        extended: true,
      }),
    );
    app.use(cors({
      origin: '*',
    }));

    app.use('/load', loadRoutes);
    app.use('/users', usersRoutes);
    app.use('/requests', requestsRoutes);
    app.get('/', async (req, res) => {
      updateReleaseDate('op')
        .then((results) => res.status(200).json(results))
        .catch((error) => res.status(400).json(error));
    });
    app.use((req, res) => {
      res.setHeader('Content-Type', 'text/plain');
      res.status(404).send('FORBIDDEN');
    });

    server.listen(3003);
  }
});
