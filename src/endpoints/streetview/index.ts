import express, { Request, Response } from 'express';
import { IBoundingBox, IMapProvider, IIncidentOptions } from 'interfaces';

interface SearchImageRequest {
  closeto: string;
}

function onSearchImage(mapProvider: IMapProvider) {
  return async (req: Request<{}, {}, SearchImageRequest>, res: Response) => {
    const closeto = req.query.closeto as string;

    try {
      const result = await mapProvider.streetView.searchImage({ closeto });
      console.log(result);
      res.json(result);
    } catch (e) {
      console.log(e);
      res.json({});
    }
  };
}

export default function startStreetViewEndpoint(router: express.Router, mapProvider: IMapProvider) {
  router.get('/images', onSearchImage(mapProvider));
}