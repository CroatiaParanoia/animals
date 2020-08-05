import paper from 'paper';
import { createCircle, createPointer, createSize } from './drawTools';
import { CardAreaInfo, CardLocationInfo, Camp } from '../types';
import { AnimalLayoutSize, animalCardConfig } from '../config';
import { getCardColor } from './tools';

export const drawGrid = ({
  startY,
  startX,
  rowCount,
  columnCount,
  gridSize,
  gridWidth,
}: Omit<AnimalLayoutSize, 'cardAreaSize'>): paper.Shape[] => {
  const localInfoArr = [];

  for (let i = 0; i < columnCount + 1; i += 1) {
    const innerStartY = startY + i * (gridSize + gridWidth);
    localInfoArr.push({
      x: startX,
      y: innerStartY,
      width: rowCount * (gridSize + gridWidth) + gridWidth,
      height: gridWidth,
    });
  }
  for (let i = 0; i < rowCount + 1; i += 1) {
    const innerStartX = startX + i * (gridSize + gridWidth);

    localInfoArr.push({
      x: innerStartX,
      y: startY,
      width: gridWidth,
      height: columnCount * (gridSize + gridWidth) + gridWidth,
    });
  }

  return localInfoArr.map(({ x, y, width, height }) => {
    const shape = new paper.Shape.Rectangle(createPointer(x, y), createSize(width, height));
    shape.fillColor = new paper.Color(1, 0, 0, 0.3);
    return shape;
  });
};

interface DrawCardArea {
  cardAreaInfoArr: CardAreaInfo[];
  cardAreaSize: number;
  onCardAreaMouseClick?: (location: CardLocationInfo) => void;
  onCardAreaMouseEnter?: (location: CardLocationInfo) => void;
  onCardAreaMouseLeave?: (location: CardLocationInfo) => void;
}

export const drawCardArea = ({
  cardAreaInfoArr,
  cardAreaSize,
  onCardAreaMouseClick,
  onCardAreaMouseEnter,
  onCardAreaMouseLeave,
}: DrawCardArea): paper.Shape[] => {
  return cardAreaInfoArr.map((item) => {
    const x = item.centerOffsetX - cardAreaSize / 2;
    const y = item.centerOffsetY - cardAreaSize / 2;
    const locationInfo: CardLocationInfo = { x: item.x, y: item.y };

    const shape = new paper.Shape.Rectangle(
      new paper.Point(x, y),
      new paper.Size(cardAreaSize, cardAreaSize),
    );
    shape.fillColor = new paper.Color(1, 0, 0, 1);
    shape.opacity = 0;
    shape.radius = cardAreaSize / 2;

    shape.onClick = () => {
      onCardAreaMouseClick?.(locationInfo);
    };
    shape.onMouseEnter = () => {
      onCardAreaMouseEnter?.(locationInfo);
      document.body.style.cursor = 'pointer';
    };
    shape.onMouseLeave = () => {
      onCardAreaMouseLeave?.(locationInfo);
      document.body.style.cursor = 'default';
    };

    shape.data = locationInfo;
    return shape;
  });
};

export interface GetPointByLocationParams extends CardLocationInfo {
  cardAreaInfoArr: CardAreaInfo[];
}
const getPointByLocation = ({ x, y, cardAreaInfoArr }: GetPointByLocationParams): paper.Point => {
  const currentItem = cardAreaInfoArr.find((v) => v.x === x && v.y === y);
  if (currentItem) {
    return new paper.Point(currentItem.centerOffsetX, currentItem.centerOffsetY);
  }
  return new paper.Point(0, 0);
};

export interface DrawActiveBorderParams {
  location: CardLocationInfo;
  cardAreaInfoArr: CardAreaInfo[];
  color: paper.Color;
  size?: paper.Size;
  cardAreaSize: number;
}
export const drawActiveBorder = ({
  location,
  color,
  size,
  cardAreaSize,
  cardAreaInfoArr,
}: DrawActiveBorderParams): paper.Group => {
  const realSize = size || new paper.Size(cardAreaSize, cardAreaSize);
  const lineWidth = 20;
  const lineHeight = 4;
  const { x: centerX, y: centerY } = getPointByLocation({ ...location, cardAreaInfoArr });
  const startX = centerX - realSize.width / 2 - lineHeight;
  const startY = centerY - realSize.height / 2 - lineHeight;

  const path = new paper.Path();
  path.lineTo(new paper.Point(startX, startY));
  path.lineTo(new paper.Point(startX + lineWidth, startY));
  path.lineTo(new paper.Point(startX + lineWidth, startY + lineHeight));
  path.lineTo(new paper.Point(startX + lineHeight, startY + lineHeight));
  path.lineTo(new paper.Point(startX + lineHeight, startY + lineWidth));
  path.lineTo(new paper.Point(startX, startY + lineWidth));
  path.lineTo(new paper.Point(startX, startY));

  path.fillColor = color;

  const leftBottomPath = path.clone();
  leftBottomPath.rotate(270, new paper.Point(centerX, centerY));

  const leftGroup = new paper.Group([path, leftBottomPath]);
  const rightGroup = leftGroup.clone();

  rightGroup.rotate(180, new paper.Point(centerX, centerY));
  const borderGroup = new paper.Group([leftGroup, rightGroup]);
  borderGroup.data = location;

  return borderGroup;
};

interface DrawCardParams {
  cardAreaInfo: CardAreaInfo;
  cardSize: number;
}
export const drawCard = ({
  cardAreaInfo,
  cardSize,
}: DrawCardParams): paper.Path.Circle | undefined => {
  const { centerOffsetX, centerOffsetY, card } = cardAreaInfo;
  if (!card) {
    return undefined;
  }

  const { camp, displayName } = card;

  const centerPointer = createPointer(centerOffsetX, centerOffsetY);

  const cardPath = createCircle(centerPointer, cardSize);

  const cardTextPath = new paper.PointText(centerPointer);
  if (camp !== Camp.Unknow) {
    cardTextPath.content = displayName;
    cardTextPath.fontSize = animalCardConfig.cardSize;
    cardTextPath.justification = 'center';
    cardTextPath.translate(createPointer(0, 15));
  }

  cardPath.fillColor = new paper.Color(getCardColor(camp));
  cardPath.shadowColor = new paper.Color('rgba(0, 0, 0, .8)');
  cardPath.shadowOffset = createPointer(0, 0);
  cardPath.shadowBlur = 5;

  return cardPath;
};
