/**
 * 斗兽棋棋子类
 *
 * create by 卢昆和 at 2019年12月28日17:45
 */

import { CARD_SIZE } from "./config";
import { CardInfo, Camp, CardAreaInfo, Location } from "./type";
import paper from "paper";

export default class AnimalCard {
  private cardAreaInfoArr: CardAreaInfo[];
  public cardInfo: CardInfo;
  public cardPath: paper.Group = new paper.Group();

  public constructor(cardInfo: CardInfo, cardAreaInfoArr: CardAreaInfo[]) {
    this.cardAreaInfoArr = cardAreaInfoArr;
    this.cardInfo = cardInfo;
    this.updCardGraphical(this.cardInfo);
  }

  public updCardGraphical = (cardInfo: CardInfo): void => {
    const {
      location: { x, y },
      overturned,
      camp,
      displayName
    } = cardInfo;
    const { centerOffsetX, centerOffsetY } = this.cardAreaInfoArr.find(
      v => v.x === x && v.y === y
    )!;
    
    this.cardPath.remove();
    const shape = new paper.Shape.Rectangle(
      new paper.Point(
        centerOffsetX - CARD_SIZE / 2,
        centerOffsetY - CARD_SIZE / 2
      ),
      new paper.Size(CARD_SIZE, CARD_SIZE)
    );

    const textPath = new paper.PointText(
      new paper.Point(centerOffsetX, centerOffsetY + 20)
    );
    
    let fillColor = null;
    if (overturned) {
      switch (camp) {
        case Camp.Alliance:
          fillColor = new paper.Color(0, 0, 1, 1);
          break;
        case Camp.Orc:
          fillColor = new paper.Color(1, 0, 0, 1);
          break;
        case Camp.Unknow:
          fillColor = new paper.Color(0, 1, 0, 1);
          break;
      }
      textPath.content = displayName;
      textPath.style.fontSize = CARD_SIZE * .8;
      textPath.style.justification = "center";
    } else {
      fillColor = new paper.Color(0, 1, 0, 1);
    }
    shape.fillColor = fillColor;
    shape.opacity = 1;
    shape.radius = CARD_SIZE / 2;

    this.cardPath = new paper.Group([shape, textPath]);
  };
}
