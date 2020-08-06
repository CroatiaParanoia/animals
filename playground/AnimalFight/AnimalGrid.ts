/**
 * 斗兽棋网格盘类
 *
 * create by 卢昆和 at 2019年12月28日17:45:57
 */
import paper from "paper";
import AnimalCard from "./AnimalCard";
import {
  START_X,
  START_Y,
  ROW_COUNT,
  COLUMN_COUNT,
  GRID_WIDTH,
  GRID_SIZE,
  CARD_AREA_SIZE,
  HOVER_BORDER_COLOR,
  ACTIVE_BORDER_COLOR,
  initCardArr,
} from "./config";
import { CardInfo, CardAreaInfo, Location } from "./type";

interface AnimalGridParams {
  onCardAreaClick?: (lcoation: Location) => void
}

export default class AnimalGrid {
  private mainLayer: paper.Layer;
  private cardAreaLayer: paper.Layer;
  public cardLayer: paper.Layer;
  private activeBorderLayer: paper.Layer;
  private cardAreaHoverBorder: paper.Group | null = null;
  private cardAreaActiveBorder: paper.Group | null = null;

  private startPoints = { x: START_X, y: START_Y };
  private rowCount = ROW_COUNT;
  private columnCount = COLUMN_COUNT;
  private gridWidth = GRID_WIDTH;
  private gridSize = GRID_SIZE;
  private cardAreaSize = CARD_AREA_SIZE;

  private onCardAreaClick: (location: Location) => void;
  private _cardAreaInfoArr: CardAreaInfo[] = [];

  get cardAreaInfoArr() {
    return this._cardAreaInfoArr;
  }

  set cardAreaInfoArr(newValue) {
    this._cardAreaInfoArr = newValue;
    // this.drawCards();
  }

  public constructor({ onCardAreaClick = () => {} }: AnimalGridParams) {
    this.mainLayer = new paper.Layer();
    this.cardLayer = new paper.Layer();
    this.cardAreaLayer = new paper.Layer();
    this.activeBorderLayer = new paper.Layer();

    this.onCardAreaClick = onCardAreaClick;
    this.computedCardAreaInfoArr();
    this.drawGrid();
    this.drawCardArea();
  }

  private drawGrid = (): void => {
    this.mainLayer.activate();
    const { x: startX, y: startY } = this.startPoints;
    const shape = new paper.Shape.Rectangle(
      new paper.Point(0, 0),
      new paper.Size(window.innerWidth, window.innerHeight)
    );
    shape.fillColor = new paper.Color(1, 1, 1);
    shape.opacity = 0;
    for (let i = 0; i < this.columnCount + 1; i++) {
      let innerStartY = startY + i * (this.gridSize + this.gridWidth);
      const shape = new paper.Shape.Rectangle(
        new paper.Point(startX, innerStartY),
        new paper.Size(
          this.rowCount * (this.gridSize + this.gridWidth) + this.gridWidth,
          this.gridWidth
        )
      );
      shape.fillColor = new paper.Color(255, 0, 0, 0.3);
    }

    for (let i = 0; i < this.rowCount + 1; i++) {
      let innerStartX = startX + i * (this.gridSize + this.gridWidth);
      const shape = new paper.Shape.Rectangle(
        new paper.Point(innerStartX, startY),
        new paper.Size(
          this.gridWidth,
          this.columnCount * (this.gridSize + this.gridWidth) + this.gridWidth
        )
      );
      shape.fillColor = new paper.Color(255, 0, 0, 0.3);
    }

    this.mainLayer.onClick = () => {
      this.removeCardAreaActive();
    };
  };

  private computedCardAreaInfoArr = (
  ): void => {
    let cardAreaInfoArr: CardAreaInfo[] = [];
    const rowPoints = this.rowCount + 1;
    const columnPoints = this.columnCount + 1;
    for (let i = 0; i < rowPoints; i++) {
      for (let j = 0; j < columnPoints; j++) {
        const { x: startX, y: startY } = this.startPoints;
        const centerPointX =
          startX + i * (this.gridWidth + this.gridSize) + this.gridWidth / 2;
        const centerPointY =
          startY + j * (this.gridWidth + this.gridSize) + this.gridWidth / 2;
        cardAreaInfoArr.push({
          x: i,
          y: j,
          centerOffsetX: centerPointX,
          centerOffsetY: centerPointY,
        });
      }
    }
    this.cardAreaInfoArr = cardAreaInfoArr;
  };

  private drawCardArea = (): void => {
    this.cardAreaLayer.activate();

    this.cardAreaInfoArr.forEach(item => {
      const x = item.centerOffsetX - this.cardAreaSize / 2;
      const y = item.centerOffsetY - this.cardAreaSize / 2;
      const localtion = { x: item.x, y: item.y };

      const shape = new paper.Shape.Rectangle(
        new paper.Point(x, y),
        new paper.Size(this.cardAreaSize, this.cardAreaSize)
      );
      shape.fillColor = new paper.Color(1, 0, 0, 1);
      shape.opacity = 0;
      shape.radius = this.cardAreaSize / 2;

      shape.onClick = () => {
        console.log(24)

        this.onCardAreaClick(localtion);
      };
      shape.onMouseEnter = () => {
        this.setGridAreaHover(localtion);
        document.body.style.cursor = "pointer";
      };
      shape.onMouseLeave = () => {
        this.removeCardAreaHover();
        document.body.style.cursor = "default";
      };
      shape.data = localtion;
    });
  };

  private getPointByLocation = ({ x, y }: Location): paper.Point => {
    const currentItem = this.cardAreaInfoArr.find(v => v.x === x && v.y === y);
    if (currentItem) {
      return new paper.Point(
        currentItem.centerOffsetX,
        currentItem.centerOffsetY
      );
    }
    return new paper.Point(0, 0);
  };

  private getCardAreaItemByLocation = ({ x, y }: Location): CardAreaInfo => {
    return this.cardAreaInfoArr.find(v => v.x === x && v.y === y)!;
  };


  private drawActiveBorder = (
    location: Location = { x: 0, y: 0 },
    color: paper.Color,
    size?: paper.Size,
  ): paper.Group => {
    this.activeBorderLayer.activate();
    size = size || new paper.Size(this.cardAreaSize, this.cardAreaSize);
    const lineWidth = 20;
    const lineHeight = 4;
    const { x: centerX, y: centerY } = this.getPointByLocation(location);
    const startX = centerX - size.width / 2 - lineHeight;
    const startY = centerY - size.height / 2 - lineHeight;

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

  private flopCard = ({ x, y }: Location): void => {
    const newCardAreaInfoArr = this.cardAreaInfoArr.map(v => {
      if (v.x === x && v.y === y) {
        return {
          ...v,
          card: {
            ...v.card!,
            overturned: true
          }
        };
      }
      return v;
    });
    this.cardAreaInfoArr = newCardAreaInfoArr;
  };

  private crushCard = (from: Location, to: Location): CardAreaInfo[] => {
    let newCardAreaInfoArr = [...this.cardAreaInfoArr];
    const fromItem = this.getCardAreaItemByLocation(from);
    const toItem = this.getCardAreaItemByLocation(to);

      return newCardAreaInfoArr.map(v => {

        if(v.x === toItem.x && v.y === toItem.y){
          return {
            ...v,
            card: fromItem.card?.level === toItem.card?.level ? undefined : fromItem.card
          }
        }

        if( v.x === fromItem.x && v.y === fromItem.y ){
          return {
            ...v,
            card: undefined
          }
        }

        return v;
      });

  }

  private fight = (from: Location, to: Location): void => {
    const fromItem = this.getCardAreaItemByLocation(from);
    const toItem = this.getCardAreaItemByLocation(to);

    const fromItemLevel = fromItem.card!.level;
    const toItemLevel = toItem.card!.level;
    console.log(fromItem, toItem, 'xxxxxxx')
    const maxLevel = Math.max(...initCardArr.map(v => v.level));
    const minLevel = Math.min(...initCardArr.map(v => v.level));

    if(fromItemLevel === maxLevel && toItemLevel === minLevel){
      alert('无法进攻比自己厉害的动物')
    }else if( fromItemLevel === minLevel && toItemLevel === maxLevel ){
      this.cardAreaInfoArr = this.crushCard(from, to);
    }
    else if( fromItemLevel < toItemLevel ){
      alert('无法进攻比自己厉害的动物')
    }else {
      this.cardAreaInfoArr = this.crushCard(from, to);
    }
    this.removeCardAreaActive();

  }

  private getCanforwardArea = (localtion: Location): Location[] => {
    const { x, y} = localtion;
    const topPoint = { x, y: y-1 };
    const bottomPoint = { x, y: y+1 };
    const leftPoint = { x: x - 1, y };
    const rightPoint = { x: x+1, y };
    return [ topPoint, bottomPoint, leftPoint, rightPoint ];
  }

  private forward = (from: Location, to: Location): void => {
      this.cardAreaInfoArr = this.crushCard(from, to);

    this.removeCardAreaActive();
  }

  private _onCardAreaClick = (localtion: Location): void => {
    
    const toItem = this.getCardAreaItemByLocation(localtion);
    let fromItem = this.cardAreaActiveBorder ? this.getCardAreaItemByLocation(this.cardAreaActiveBorder.data) : undefined;
    const toLocation = { x: toItem.x, y: toItem.y };
    
    // console.log(`你当前正在点击(${item.x}, ${item.y})`);
    console.log(fromItem, 'fromItem', toItem)

    let canMove = false;

    if( fromItem && this.getCanforwardArea(toLocation).find(v => v.x === fromItem!.x && v.y === fromItem!.y) ){
      canMove = true;
    }

    
    if(toItem.card){
      // 如果目标有棋牌
      if (toItem.card.overturned) {
        if( fromItem && fromItem.card!.camp !== toItem.card.camp){
          const fromLocation = { x: fromItem.x, y: fromItem.y }
          canMove && this.fight(fromLocation, toLocation);
        }else {
          this.setGridAreaActive(localtion);
        }
      } else {
        // 没有翻牌, 开始翻牌
        this.flopCard(localtion);
        this.removeCardAreaActive();
      }
    }else {
    // 如果目标没棋牌， 则前进

      canMove && fromItem && this.forward({x: fromItem.x, y: fromItem.y}, toLocation);
    }
  };

  public getLastActiveLocation = (): Location | undefined => {
    return this.cardAreaActiveBorder?.data;
  }

  public setGridAreaActive = (
    location: Location = { x: 0, y: 0 },
    color?: paper.Color,
    size?: paper.Size,
  ): void => {
    this.removeCardAreaActive();
    color = color || ACTIVE_BORDER_COLOR;
    this.cardAreaActiveBorder = this.drawActiveBorder(location, color, size);
  };

  public setGridAreaHover = (
    localtion: Location, 
    color?: paper.Color,
    size?: paper.Size,
    ): void => {
    this.removeCardAreaHover();
    color = color || HOVER_BORDER_COLOR;
    this.cardAreaHoverBorder = this.drawActiveBorder(
      localtion,
      color,
      size,
    );
  }

  public removeCardAreaActive = (): void => {
    this.cardAreaActiveBorder?.remove();
    this.cardAreaActiveBorder = null;
  };

  public removeCardAreaHover = (): void => {
    this.cardAreaHoverBorder?.remove();
    this.cardAreaHoverBorder = null;
  }
}
