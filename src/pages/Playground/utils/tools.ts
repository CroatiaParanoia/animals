import { initCardArr, AnimalLayoutSize, animalCardConfig } from '../config';
import { CardAreaInfo, Camp, CardInfo } from '../types';

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

export const fillCards = (cardAreaInfoArr: CardAreaInfo[]) => {
  const charts = generateCards().map((item) => ({ ...item, camp: Camp.Unknow }));

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
      return animalCardConfig.allianceCardColor;
    case Camp.Orc:
      return animalCardConfig.orcCardColor;
    default:
      return animalCardConfig.unknowCardColor;
  }
};
