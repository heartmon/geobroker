import { IMapProvider, ITrafficService } from 'interfaces';
import HereTrafficService from './services/HereTrafficService';
import MapillaryService from './services/MapillaryService';

class HereProvider implements IMapProvider {
  name = 'here';
  apiKey: string;
  traffic: ITrafficService;
  streetView: MapillaryService;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.traffic = new HereTrafficService(apiKey);
    this.streetView = new MapillaryService();
  }
}

export default HereProvider;