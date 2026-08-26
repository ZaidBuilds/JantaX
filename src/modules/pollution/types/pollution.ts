export type AqiCategory = 
  | 'Good' 
  | 'Satisfactory' 
  | 'Moderate' 
  | 'Poor' 
  | 'Very Poor' 
  | 'Severe' 
  | 'Severe Plus';

export type PollutantType = 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'Ozone';

export interface HourlyAqi {
  hour: string;
  aqi: number;
  pm25: number;
}

export interface AirQualityStation {
  id: string; // e.g. "AQI-DL-ITO01"
  stationName: string;
  stationNameHi: string;
  operator: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  currentAqi: number;
  category: AqiCategory;
  prominentPollutant: PollutantType;
  pm25Value: number; // ug/m3 (standard 60)
  pm10Value: number; // ug/m3 (standard 100)
  no2Value: number; // ug/m3 (standard 80)
  healthAdvisory: string;
  healthAdvisoryHi: string;
  sensitiveGroupWarning: string;
  trend24h: HourlyAqi[];
  latitude: number;
  longitude: number;
  lastUpdated: string;
  sourceUrl: string;
}

export interface GrapStageRule {
  stageNumber: 1 | 2 | 3 | 4;
  stageName: string;
  stageNameHi: string;
  aqiThreshold: string;
  isActive: boolean;
  bannedActivities: string[];
  allowedActivities: string[];
  mandatoryCitizenActions: string[];
  enforcingAuthority: string;
  gazetteOrderNumber: string;
  effectiveDate: string;
}

export interface PollutionFilter {
  query?: string;
  city?: string;
  category?: AqiCategory | 'All';
  prominentPollutant?: PollutantType | 'All';
  pinCode?: string;
  minAqi?: number;
  sortBy?: 'aqi_desc' | 'aqi_asc' | 'pm25_desc';
}
