import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';

const app = express();

app.use(helmet());

app.get('/', (req, res) => {
  logger.info('Hello from Acquisitions Service!');

  res.status(200).send('Acquisitions Service is up and running!');
});

export default app;
