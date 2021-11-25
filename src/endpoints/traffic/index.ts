import express, { Request, Response } from 'express';
import { IBoundingBox, IMapProvider, IIncidentOptions } from 'interfaces';

interface IFlowRequest {
  bbox: IBoundingBox;
}

interface IIncidentRequest {
  bbox: IBoundingBox;
  options: IIncidentOptions;
}

function onFlowRequest(mapProvider: IMapProvider) {
  return async (req: Request<{}, {}, IFlowRequest>, res: Response) => {
    const { bbox } = req.body;

    const result = await mapProvider.traffic.getFlow(bbox);
    res.json(result);
  };
}

function onIncidentRequest(mapProvider: IMapProvider) {
  return async (req: Request<{}, {}, IIncidentRequest>, res: Response) => {
    const { bbox, options } = req.body;


    const result = await mapProvider.traffic.getIncident(bbox, options);
    res.json(result);
  };
}

export default function startTrafficEndpoint(router: express.Router, mapProvider: IMapProvider) {
  router.post('/flow', onFlowRequest(mapProvider));
  router.post('/incidents', onIncidentRequest(mapProvider));
}