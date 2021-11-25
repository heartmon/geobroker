import { ILatLng } from 'interfaces';
import got from 'got';

interface SearchImageParams {
  closeto: string;
}

const CLIENT_ID = 'd0ZjUXpCMG9OQ1dkQkhtdkhsUmxnVTphYjhiMmZhZTY5YTIzZDIz';

class MapillaryService {
  private baseUrl: string;
  private version: string;

  constructor() {
    this.baseUrl = 'https://a.mapillary.com/';
    this.version = 'v3';
  }

  private getUrl(serviceType: string) {
    return `${this.baseUrl}${this.version}/${serviceType}`;
  }

  public searchImage(userParams: SearchImageParams) {
    const serviceType = 'images';
    const url = new URL(this.getUrl(serviceType));

    const defaultParams = { clientId: CLIENT_ID };

    const params = Object.assign({}, defaultParams, {
      closeto: userParams.closeto
    });

    url.search = new URLSearchParams(params).toString();

    // fetch
    console.log('***', url.toString());

    return got(url).json();
  }
}

export default MapillaryService;
