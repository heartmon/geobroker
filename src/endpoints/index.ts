import express from 'express';
import { IMapProvider } from 'interfaces';
import startTrafficEndpoint from './traffic';
import startStreetViewEndpoint from './streetview';

export default function startGeobrokerEndpoint(app: express.Application, mapProvider: IMapProvider) {
  const trafficRouter = express.Router();
  const streetViewRouter = express.Router();
  
  // init endpoints
  startTrafficEndpoint(trafficRouter, mapProvider);
  startStreetViewEndpoint(streetViewRouter, mapProvider);

  // set in application
  app.use('/traffic', trafficRouter);
  app.use('/streetview', streetViewRouter);
};
