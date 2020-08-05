import paper from 'paper';

export const initCardArr = [
  { name: "象", displayName: "🐘", level: 7 },
  { name: "狮", displayName: "🦁", level: 6 },
  { name: "虎", displayName: "🐯", level: 5 },
  { name: "豹", displayName: "🐆", level: 4 },
  { name: "狼", displayName: "🐺", level: 3 },
  { name: "狗", displayName: "🐶", level: 2 },
  { name: "猫", displayName: "🐈", level: 1 },
  { name: "鼠", displayName: "🐭", level: 0 }
];

export const START_X = 50;
export const START_Y = 50;

export const ROW_COUNT = 3;
export const COLUMN_COUNT = 3;

export const GRID_WIDTH = 10;
export const GRID_SIZE = 100;
export const CARD_SIZE = 50;
export const CARD_AREA_SIZE = 60;

export const HOVER_BORDER_COLOR = new paper.Color(0, 0, 0.5, 0.3);
export const ACTIVE_BORDER_COLOR = new paper.Color(0, 0, 0.5, 0.8);