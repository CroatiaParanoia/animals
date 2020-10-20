export const initCardArr = [
  { name: '象', displayName: '🐘', level: 7 },
  { name: '狮', displayName: '🦁', level: 6 },
  { name: '虎', displayName: '🐯', level: 5 },
  { name: '豹', displayName: '🐆', level: 4 },
  { name: '狼', displayName: '🐺', level: 3 },
  { name: '狗', displayName: '🐶', level: 2 },
  { name: '猫', displayName: '🐈', level: 1 },
  { name: '鼠', displayName: '🐭', level: 0 },
];

export const animalLayoutSize = {
  startX: 50,
  startY: 50,
  rowCount: 3,
  columnCount: 3,
  gridWidth: 10,
  gridSize: 100,
  cardAreaSize: 70,
};

export type AnimalLayoutSize = typeof animalLayoutSize;

export const animalLayoutColor = {
  hoverBorderColor: 'rgba(0, 0, 128, 0.3)',
  activeBorderColor: 'rgba(0, 0, 128, 0.8)',
};

export const animalCardConfig = {
  Alliance: '#57c4e5',
  Orc: '#ee6b5c',
  Unknow: '#e6caa2',

  cardSize: 42,
};
