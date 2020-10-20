import { initCardArr, AnimalLayoutSize, animalCardConfig } from '../config';
import { CardAreaInfo, Camp, CardInfo, CardLocationInfo } from '../types';

export const createCardAreaInfoArr = ({
  rowCount,
  columnCount,
  startX,
  startY,
  gridSize,
  gridWidth,
}: Omit<AnimalLayoutSize, 'cardAreaSize'>): CardAreaInfo[] => {
  const cardAreaInfoArr: CardAreaInfo[] = [];
  const rowPoints = rowCount + 1;
  const columnPoints = columnCount + 1;
  for (let i = 0; i < rowPoints; i += 1) {
    for (let j = 0; j < columnPoints; j += 1) {
      const centerPointX = startX + i * (gridWidth + gridSize) + gridWidth / 2;
      const centerPointY = startY + j * (gridWidth + gridSize) + gridWidth / 2;
      cardAreaInfoArr.push({
        x: i,
        y: j,
        centerOffsetX: centerPointX,
        centerOffsetY: centerPointY,
        card: null,
      });
    }
  }

  return cardAreaInfoArr;
};

export const generateCards = (): CardInfo[] => {
  const createCampCard = (camp: Camp) => initCardArr.map((v) => ({ ...v, camp }));
  return createCampCard(Camp.Alliance)
    .concat(createCampCard(Camp.Orc))
    .sort(() => Math.random() - 0.5);
};

type DataTypes = 'Number' | 'String' | 'Array' | 'Boolean' | 'Null' | 'Object' | 'Function';

export const typeOf = (value: any): DataTypes => {
  return {}.toString.call(value).slice(8, -1) as DataTypes;
};

export const getDefaultValueByType = (type: DataTypes) => {
  const valueMap: Record<DataTypes, any> = {
    Number: 0,
    String: '',
    Array: () => [],
    Boolean: false,
    Null: null,
    Object: () => ({}),
    Function: () => () => {},
  };

  const value = valueMap[type];

  if (typeOf(value) === 'Function') {
    return value();
  }
  return value;
};

export const clear = <T extends Partial<Record<string, any>>>(obj: T): T => {
  return Object.keys(obj).reduce((res, key) => {
    const cur = obj[key];
    const dataType = typeOf(obj[key]);
    return {
      ...res,
      [key]: dataType === 'Object' ? clear(cur) : getDefaultValueByType(dataType),
    };
  }, {} as T);
};

export const fillCards = (cardAreaInfoArr: CardAreaInfo[]) => {
  const charts = generateCards().map((item) => ({ ...clear(item), camp: Camp.Unknow }));

  return cardAreaInfoArr.map((v, i) => {
    return {
      ...v,
      card: charts[i],
    };
  });
};

export const getCardColor = (camp: Camp): string => {
  switch (camp) {
    case Camp.Alliance:
      return animalCardConfig.Alliance;
    case Camp.Orc:
      return animalCardConfig.Orc;
    default:
      return animalCardConfig.Unknow;
  }
};

export const isEnemy = (selfCamp: Camp, camp: Camp): boolean => {
  return selfCamp !== camp && camp !== Camp.Unknow;
};

export const fight = (selfLevel: number, enemyLevel: number): 'win' | 'lose' | 'equalize' => {
  const maxLevel = Math.max(...initCardArr.map((v) => v.level));

  if ((selfLevel === 0 && enemyLevel === maxLevel) || selfLevel > enemyLevel) {
    return 'win';
  }

  if (selfLevel < enemyLevel) {
    return 'lose';
  }

  return 'equalize';
};

export const locationEqual = (location1: CardLocationInfo, location2: CardLocationInfo) => {
  return location1.x === location2.x && location1.y === location2.y;
};

export const getAllowMoveLocations = ({ x, y }: CardLocationInfo) => {
  return [
    { x: x - 1, y },
    { x, y: y - 1 },
    { x: x + 1, y },
    { x, y: y + 1 },
  ] as [CardLocationInfo, CardLocationInfo, CardLocationInfo, CardLocationInfo];
};

export const canMove = (originLocation: CardLocationInfo, targetLocation: CardLocationInfo) => {
  const allowMoveLocations = getAllowMoveLocations(originLocation);

  return Boolean(allowMoveLocations.find((v) => locationEqual(v, targetLocation)));
};
