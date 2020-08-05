export enum Camp {
  Alliance,
  Orc,
  Unknow,
}

export interface CardInfo {
  name: string;
  displayName: string;
  level: number;
  camp: Camp;
  overturned: boolean;
  location: Location
}

export interface CardAreaInfo {
  x: number;
  y: number;
  centerOffsetX: number;
  centerOffsetY: number;
  card?: CardInfo,
}

export interface Location {
  x: number;
  y: number;
}


export enum Status {
  Success,
  Fail,
  Error
}

export interface Response {
  status: Status;
  msg?: string;
}

export interface AnimalFightParams {
  element: HTMLCanvasElement;
  onFlop: (location: Location) => void;
  onForward: (from: Location, to: Location) => void;
  onAttack: (from: Location, to: Location) => void;
}