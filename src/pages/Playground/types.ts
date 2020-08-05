export interface CardLocationInfo {
  x: number;
  y: number;
}

export interface CardAreaInfo extends CardLocationInfo {
  centerOffsetX: number;
  centerOffsetY: number;
  card?: CardInfo;
}

export enum Camp {
  Alliance = 'Alliance',
  Orc = 'Orc',
  Unknow = 'Unknow',
}

export interface CardInfo {
  name: string;
  displayName: string;
  level: number;
  camp: Camp;
}
