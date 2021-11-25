
/*
  Information
  https://stackoverflow.com/questions/34066427/interpreting-here-maps-real-time-traffic-tags
  http://documentation.developer.here.com/pdf/traffic_hlp/6.0.68.0/Traffic%20API%20v6.0.68.0%20Developer's%20Guide.pdf
*/

export interface IHereTrafficFlowResponse {
  RWS: IHereRWS[];
  MAP_VERSION?: string;
  CREATED_TIMESTAMP?: string;
  VERSION?: string;
  UNITS?: string;
}

export interface IHereTrafficIncidentResponse {
  TIMESTAMP: string;
  VERSION: string;
  TRAFFIC_ITEMS: {
    TRAFFIC_ITEM: Array<IHereTrafficItem>;
  }
  diagnostic: {
    info: string;
    sfile: string;
    pdd: string;
  }
  TIMESTAMP2?: string;
  EXTENDED_COUNTRY_CODE: string;
}

export type IHereTrafficItem = {
  TRAFFIC_ITEM_ID: string;
  ORIGINAL_TRAFFIC_ITEM_ID: string;
  TRAFFIC_ITEM_STATUS_SHORT_DESC: string;
  TRAFFIC_ITEM_TYPE_DESC: string;
  START_TIME: string;
  END_TIME: string;
  ENTRY_TIME: string;
  CRITICALITY: {
    id: string;
    DESCRIPTION: string;
  };
  VERIFIED: boolean;
  ABBREVIATION: {
    SHORT_DESC: string;
    DESCRIPTION: string;
  };
  'RDS-TMC_LOCATIONS': unknown;
  LOCATION: {
    GEOLOC: IHereTrafficLocationGeoLoc
  };
  TRAFFIC_ITEM_DETAIL: {
    ROAD_CLOSED: boolean;
    INCIDENT: {
      RESPONSE_VEHICLES: boolean;
      MISCELLANEOUS_INCIDENT: {}
    }
  };
  TRAFFIC_ITEM_DESCRIPTION: Array<{ value: string, TYPE: string }>;
  mid: string;
  PRODUCT: string;
  COMMENTS: string;
}

export type IHereTrafficLocationGeoLoc = {
  ORIGIN: IHereTrafficLocationLatLng;
  TO: IHereTrafficLocationLatLng[];
  GEOMETRY?: IHereSHP[],
}

export type IHereTrafficLocationLatLng = {
  LATITUDE: number;
  LONGITUDE: number;
}

export interface IHereRWS {
  RW: IHereRW[];
  TY: string;
  MAP_VERSION: string;
  EBU_COUNTRY_CODE: string;
  EXTENDED_COUNTRY_CODE: string;
  TABLE_ID: string;
  UNITS: string;
}

export interface IHereRW {
  FIS: IHereFIS;
  mid: string;
  LI: string;
  DE: string;
  PBT: string;
}

export interface IHereFIS {
  FI: IHereFI[];
}

// interface for FI (A single flow item)
export interface IHereFI {
  TMC: {
    PC: string;
    DE: string;
    QD: string;
    LE: number;
  },
  SHP: IHereSHP[],
  CF: {
    TY: string;
    SP: number;
    SU: number;
    FF: number;
    JF: number;
    CN: number;
  }[]
}

export interface IHereSHP {
  value: string[];
  FC: number;
}

export type IHereIncidentOptions = {
  c?: string;
  lg?: string;
  i18n?: boolean;
  localtime?: boolean;
  units?: string;
  status?: string;
  maxresults?: number;
}

export enum TrafficResourceType {
  Flow = 'flow',
  Incident = 'incidents'
}