/**
 * 斗兽棋
 * 作为棋盘与棋子间的controller 来调控两者间的动作
 * create by 卢昆和 at 2019年12月28日17:45
 */
import paper from "paper";
import AnimalGrid from "./AnimalGrid";
import AnimalCard from "./AnimalCard";

import { CardInfo, Camp, Location, AnimalFightParams } from "./type";
import { initCardArr } from "./config";
import cardJson from "./cardJson.json";

let cardInfoArr = cardJson;

export default class AnimalFight {
  private selfCamp: Camp = Camp.Alliance;
  private cards: AnimalCard[] = [];

  get activeLocation() {
    return this.animalGrid.getLastActiveLocation();
  }

  get cardAreaInfoArr() {
    return this.animalGrid.cardAreaInfoArr;
  }

  get cardLayer() {
    return this.animalGrid.cardLayer;
  }

  private animalGrid: AnimalGrid;

  private onAttack: AnimalFightParams["onAttack"];
  private onFlop: AnimalFightParams["onFlop"];
  private onForward: AnimalFightParams["onForward"];

  // private animalWs: AnimalWs;

  public constructor({
    element,
    onAttack,
    onFlop,
    onForward
  }: AnimalFightParams) {
    paper.setup(element);

    this.onAttack = onAttack;
    this.onFlop = onFlop;
    this.onForward = onForward;

    this.animalGrid = new AnimalGrid({
      onCardAreaClick: this.onCardAreaClick
    });

    this.renderAnimalCards();
  }

  public getCardByLocation = (location?: Location): CardInfo | undefined => {
    if (!location) {
      return;
    }
    return cardInfoArr.find(
      v => v.location.x === location.x && v.location.y === location.y
    );
  };

  public getCardInstanceByLocation = (
    location?: Location
  ): AnimalCard | undefined => {
    if (!location) {
      return;
    }
    return this.cards.find(v => {
      const { x, y } = v.cardInfo.location;
      return x === location.x && y === location.y;
    });
  };

  public onCardAreaClick = (location: Location): void => {
    const activeCard = this.getCardByLocation(this.activeLocation);
    const currentCard = this.getCardByLocation(location);

    if (currentCard && activeCard) {
      // active 或者翻牌，或者进攻
      if (!currentCard.overturned) {
        // 目标牌未知， 翻牌
        console.log("翻牌");
        // this.flopCard(location);
        this.onFlop(location);
        return;
      } else if (currentCard.camp === activeCard.camp) {
        // 同阵营，切换active
        console.log("切换active");
        this.animalGrid.setGridAreaActive(currentCard.location);
      } else {
        // 不同阵营， 进攻.
        console.log("进攻");
        this.onAttack(activeCard.location!, location);
      }
    } else if (currentCard) {
      // active 或者翻牌

      if (!currentCard.overturned) {
        // 目标牌未知， 翻牌
        console.log("翻牌");
        // this.flopCard(location);
        this.onFlop(location);
      } else if (currentCard.camp === this.selfCamp) {
        // 同阵营，切换active
        console.log("切换active");
        this.animalGrid.setGridAreaActive(currentCard.location);
      }
    } else if (activeCard) {
      // 移动
      console.log("移动");
      // this.moveCard(activeCard.location, location);
      this.onForward(activeCard.location!, location);
    }

    // if (currentCard) {
    //   this.animalGrid.setGridAreaActive(location);
    // }
    // 1. 翻牌，overturned = false
    // if(currentCard?.overturned)
  };

  public renderAnimalCards = (): void => {
    this.cardLayer.activate();
    cardJson.forEach(item => {
      this.cards.push(new AnimalCard(item, this.cardAreaInfoArr));
    });
  };

  public moveCard = (from: Location, to: Location): void => {
    console.log({ from, to }, "moveCard");
    this.animalGrid.removeCardAreaHover();
    this.animalGrid.removeCardAreaActive();
    this.updCardInfo(from, {
      location: to
    });
  };

  public flopCard = (location: Location): void => {
    this.animalGrid.removeCardAreaActive();
    console.log(location, "flopCard");
    // 请求这个位置的数据。
    this.updCardInfo(location, {
      overturned: true,
      name: "狮",
      displayName: "🦁",
      level: 6,
      camp: Camp.Orc
    });
  };

  public updCardInfo = (location: Location, data: Object = {}) => {
    const cardInfo = this.getCardByLocation(location);
    if (cardInfo) {
      const oldLocation = cardInfo.location;
      const instance = this.getCardInstanceByLocation(oldLocation)!;
      const newCardInfo = Object.assign(cardInfo, data);
      this.cardLayer.activate();
      instance.updCardGraphical(newCardInfo);
    }
  };
}
