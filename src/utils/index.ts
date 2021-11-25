import { ILatLng } from 'interfaces';

export const toLatLng: (lat: number, lng: number) => ILatLng = (lat, lng) => ({ lat, lng });
