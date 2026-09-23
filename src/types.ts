export interface BusService {
  serviceNo: string;
  next: number[]; // 0 means "Arriving", 1 or 2 whole numbers
}

export interface BusArrivalData {
  stopCode: string;
  fetchedAt: string;
  services: BusService[];
}

export interface RainArea {
  area: string;
  forecast: string;
  rainExpected: boolean;
}

export interface RainData {
  validPeriod: string;
  updatedAt: string;
  areas: RainArea[];
}

export interface FavouriteStop {
  stopCode: string;
  stopName: string;
  area: string;
  services: string[]; // List of starred bus service numbers at this stop
}

export interface NearbyStop {
  stopCode: string;
  description: string;
  roadName: string;
  approxMetres: number;
}

export interface StopSearchResult {
  stopCode: string;
  description: string;
  roadName: string;
}

export interface StopInfo {
  stopCode: string;
  description: string;
  roadName: string;
  latitude?: number;
  longitude?: number;
  nearby: NearbyStop[];
}

export type FetchState = 'idle' | 'loading' | 'success' | 'empty' | 'refused' | 'unreachable' | 'not_found';

export const SENTENCES = {
  BUS: {
    loading: (stopCode: string = '[stop code]') => `Checking buses at bus stop ${stopCode}…`,
    empty: (stopCode: string = '[stop code]') =>
      `No bus services at bus stop ${stopCode} right now!! Check the 5-digit code on the bus stop pole, or try again after 5:30 am.`,
    refused: (status: string | number = 'unknown') =>
      `Unable to retrieve bus arrivals (error ${status})!!`,
    unreachable:
      'No connection to LTA!! Check the timetable at the stop or try again shortly.',
  },
  RAIN: {
    loading: (area: string = '[area]') => `Checking the weather for the ${area} area…`,
    empty: (area: string = '[area]') =>
      `Weather forecast currently unavailable for the ${area} area!! Try again in a few minutes.`,
    refused: (status: string | number = 'unknown') =>
      `Unable to retrieve weather forecast (error ${status})!! Try again in a minute.`,
    unreachable:
      'No connection to the weather service!! Look out of the window for now.',
  },
  FAVOURITES: {
    savedBusNotRunning: (service: string = '[service]') =>
      `Bus ${service} currently not in service!!`,
    stopCodeInvalid:
      'Bus stop code is invalid!! The 5-digit code is printed on the pole at the bus stop.',
    stopCodeNotFound:
      'Bus stop code is invalid!! The 5-digit code is printed on the pole at the bus stop.',
    noFavourites:
      'No favourite bus stops saved yet!! Tap the star on any bus arrival in Live Bus Arrivals to add it here.',
  },
};
