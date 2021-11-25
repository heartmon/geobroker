import express from 'express';
// @ts-ignore
import { LoggerFactory } from 'slf';
import HereProvider from './providers/here/HereProvider';
import { HERE_API_KEY } from './constants';
import startGeobrokerEndpoint from 'endpoints';
import cors from 'cors';
import bodyParser from 'body-parser';

const LOG = LoggerFactory.getLogger('lx3:event-checker:main');
const port = process.env.PORT || 3443;
const app = express();

const ALLOW_ORIGINS = [
    'http://localhost:3000'
  ];

// Map provider
const hereProvider = new HereProvider(HERE_API_KEY);

// Middlewares
app.use(bodyParser.json());
app.use(cors({
  origin: ALLOW_ORIGINS
}));

// Endpoints
app.get('/ping', (req, res) => { res.json({ message: 'Hello from Geobroker' }); })
startGeobrokerEndpoint(app, hereProvider);

// Error handlings
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500);
  res.json({ error: err });
});

app.listen(port, async () => {
  try {
    // just for testing
    hereProvider.traffic.getIncident({
      // topLeft: { lat: 51.5082, lng: -0.1285 },
      // bottomRight: { lat: 51.5062, lng: -0.1265 }
      bottomRight: {lng: 13.813215823529703, lat: 50.21358573336252},
      topLeft: {lng: 13.991263466796795, lat: 50.31198113861177}
    }).then((result) => {
      // console.log(result);
    })
  } catch (e) {
    LOG.error(e);
    process.exit(1);
  }
  // @ts-ignore
  if (__DEV__) { // webpack flag
    LOG.debug('> Server starting in development mode');
  }
  LOG.debug(`> Server listening on port ${port}`);
});

