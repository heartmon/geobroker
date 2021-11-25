import { ITrafficService, IBoundingBox, IFlowItem, IFlowResponse, ILatLng, ITransformShape, IIncidentResponse, IIncidentOptions, ITrafficItem } from 'interfaces';
import { trim, flatMap, map, reduce, find } from 'lodash';
import got from 'got';
import querystring from 'querystring';
import { toLatLng } from 'utils';
import { TrafficResourceType, IHereIncidentOptions, IHereTrafficIncidentResponse, IHereTrafficFlowResponse, IHereRWS, IHereFI, IHereRW, IHereFIS, IHereSHP, IHereTrafficItem, IHereTrafficLocationLatLng } from '../HereInterfaces';

class HereTrafficService implements ITrafficService {
  apiKey: string;
  apiVersion: number;

  constructor(apiKey: string, apiVersion = 6.3) {
    this.apiKey = apiKey;
    this.apiVersion = apiVersion;
  }

  getBaseUrl = (resourceType: TrafficResourceType, format = 'json') => `https://traffic.ls.hereapi.com/traffic/${this.apiVersion}/${resourceType}.${format}?apiKey=${this.apiKey}`;

  getIncident: (bbox: IBoundingBox, options?: IIncidentOptions) => Promise<IIncidentResponse> = async (bbox, options) => {
    const parsedBbox = `${bbox.topLeft?.lat},${bbox.topLeft?.lng};${bbox.bottomRight?.lat},${bbox.bottomRight?.lng}`;
    const hereOptions = this.transformIncidentOptions(options);
    const queryStringOptions = querystring.stringify(hereOptions);
    const uri = `${this.getBaseUrl(TrafficResourceType.Incident)}&bbox=${parsedBbox}&${queryStringOptions}`;
    const res: any = await got(uri).json() as IHereTrafficIncidentResponse;
    return this.formatIncidentResponse(res);
  }

  getFlow: (bbox: IBoundingBox) => Promise<IFlowResponse> = async (bbox) => {
    const parsedBbox = `${bbox.topLeft?.lat},${bbox.topLeft?.lng};${bbox.bottomRight?.lat},${bbox.bottomRight?.lng}`;
    const uri = `${this.getBaseUrl(TrafficResourceType.Flow)}&bbox=${parsedBbox}&responseattributes=sh,fc`;
    const res = await got(uri).json() as IHereTrafficFlowResponse;
    return this.formatFlowResponse(res);
  }

  transformIncidentOptions: (options?: IIncidentOptions) => IHereIncidentOptions = (options) => {
    if (!options) {
      return {};
    }
    return {
      c: options.countryCode,
      lg: options.languageCode,
      i18n: true
    }
  }

  formatFlowResponse: (result: IHereTrafficFlowResponse) => IFlowResponse = (result) => {
    const roads = flatMap<IHereRWS, unknown>(result.RWS, (rws: IHereRWS) => flatMap(rws.RW, (rw: IHereRW) => flatMap(rw.FIS, (fis: IHereFIS) => flatMap(fis.FI)))) as IHereFI[];
    const transformedFlowItems = map<IHereFI, IFlowItem>(roads, (road: IHereFI) => {

      const tmc = {
        description: road.TMC.DE,
        postCode: road.TMC.PC
      };

      const currentFlow = {
        jamFactor: road.CF[0]?.JF,
        speedUncapped: road.CF[0]?.SU,
        speed: road.CF[0]?.SP,
        confidence: road.CF[0]?.CN,
        freeFlowSpeed: road.CF[0]?.FF
      };

      const shapes = map<IHereSHP, ITransformShape>(road.SHP, this.fromShapeToLatLng);

      return {
        tmc,
        currentFlow,
        shapes
      }
    });

    return transformedFlowItems;
  }

  fromShapeToLatLng = (shape: IHereSHP) => {
    const lines = reduce<string, ILatLng[][]>(shape.value, (result, latLngString) => {
      try {
        const splits = trim(latLngString).split(' ');

        const latLngArrays = map(splits, (latLng) => {
          const latLngArray = latLng.split(',');
          return {
            lat: parseFloat(latLngArray[0]),
            lng: parseFloat(latLngArray[1])
          }
        });

        result.push(latLngArrays);
        return result;
      } catch (e) {
        return result;
      }
    }, []);
    return {
      lines,
      functionalClass: shape.FC
    }
  }

  formatIncidentResponse: (result: IHereTrafficIncidentResponse) => IIncidentResponse = (result) => {
    const trafficItems = map<IHereTrafficItem, ITrafficItem>(result.TRAFFIC_ITEMS?.TRAFFIC_ITEM, (hti) => {
      const transformed: ITrafficItem = {
        id: hti.TRAFFIC_ITEM_ID,
        criticality: {
          id: hti.CRITICALITY.id,
          description: hti.CRITICALITY.DESCRIPTION
        },
        startTime: hti.START_TIME,
        endTime: hti.END_TIME,
        entryTime: hti.ENTRY_TIME,
        comments: hti.COMMENTS,
        description: find(hti.TRAFFIC_ITEM_DESCRIPTION, { TYPE: 'desc' })?.value || '',
        shortDescrption: find(hti.TRAFFIC_ITEM_DESCRIPTION, { TYPE: 'short_desc' })?.value || '',
        noExitDescription: find(hti.TRAFFIC_ITEM_DESCRIPTION, { TYPE: 'no_exit_description' })?.value || '',
        status: hti.TRAFFIC_ITEM_STATUS_SHORT_DESC,
        type: hti.TRAFFIC_ITEM_TYPE_DESC,
        verified: hti.VERIFIED,
        location: {
          origin: toLatLng(hti.LOCATION.GEOLOC.ORIGIN.LATITUDE, hti.LOCATION.GEOLOC.ORIGIN.LONGITUDE),
          to: map<IHereTrafficLocationLatLng, ILatLng>(hti.LOCATION.GEOLOC.TO, (latLng) => toLatLng(latLng.LATITUDE, latLng.LONGITUDE))
        },
        shapes: map<IHereSHP, ITransformShape>(hti.LOCATION.GEOLOC.GEOMETRY, this.fromShapeToLatLng)
      };
      return transformed;
    });

    const response: IIncidentResponse = {
      timestamp: result.TIMESTAMP,
      version: result.VERSION,
      trafficItems
    }

    return response;
  }
}

export default HereTrafficService;

