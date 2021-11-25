import { IHereIncidentOptions } from 'providers/here/HereInterfaces';
import MapillaryService from 'providers/here/services/MapillaryService';

interface ILatLng {
  lat: number;
  lng: number;
}

interface IBoundingBox {
  topLeft: ILatLng;
  bottomRight: ILatLng;
}

interface ITrafficService {
  apiKey: string;
  getIncident: (bbox: IBoundingBox, options?: IIncidentOptions) => Promise<IIncidentResponse>;
  getFlow: (bbox: IBoundingBox) => Promise<IFlowResponse>;
}

interface IFlowItem {
  tmc: {
    description: string;
    postCode: string;
  },
  currentFlow: {
    jamFactor: number;
    speedUncapped: number;
    speed: number;
    confidence: number;
    freeFlowSpeed: number;
  },
  shapes: ITransformShape[];
}

interface ITransformShape {
  lines: ILatLng[][];
  functionalClass: number;
}

type IFlowResponse = IFlowItem[];

interface ITrafficItem {
  id: string;
  status: string;
  type: string;
  startTime: string;
  endTime: string;
  entryTime: string;
  criticality: { id: string, description: string };
  verified: boolean;
  shortDescrption: string;
  description: string;
  noExitDescription: string;
  location: {
    origin: ILatLng;
    to: Array<ILatLng>;
  },
  comments: string,
  shapes?: Array<ITransformShape>
}

type IIncidentResponse = {
  timestamp: string;
  version: string;
  trafficItems: Array<ITrafficItem>
}

type IIncidentOptions = {
  languageCode: string;
  countryCode: string;
}

interface IMapProvider {
  name: string;
  apiKey: string;
  traffic: ITrafficService;
  streetView: MapillaryService;
}

export {
  ILatLng,
  IMapProvider,
  ITrafficService,
  IBoundingBox,
  IFlowItem,
  IFlowResponse,
  ITransformShape,
  IIncidentResponse,
  ITrafficItem,
  IIncidentOptions
}