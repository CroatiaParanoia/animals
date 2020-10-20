import { useEffect, useCallback, useState } from 'react';

import paper from 'paper';

import useEventCallback from '../../../hooks/useEventCallback';
import { drawGrid, drawCardArea, drawActiveBorder } from '../utils/drawPolygon';
import { createCardAreaInfoArr, isEnemy, fight, locationEqual, canMove } from '../utils/tools';
import { CardLocationInfo, Camp, CardAreaInfo } from '../types';

import { animalLayoutSize, animalLayoutColor } from '../config';

import useAnimalCards from './useAnimalCards';
import useAnimalTools from './useAnimalTools';
import usePaperLayer from './usePaperLayer';
import useDealCards from './useDealCards';

// const initCardAreaInfoArr = createCardAreaInfoArr({
//   ...animalLayoutSize,
// });

const initCardAreaInfoArr = [
  {
    x: 0,
    y: 0,
    centerOffsetX: 55,
    centerOffsetY: 55,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 0,
    y: 1,
    centerOffsetX: 55,
    centerOffsetY: 165,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 0,
    y: 2,
    centerOffsetX: 55,
    centerOffsetY: 275,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 0,
    y: 3,
    centerOffsetX: 55,
    centerOffsetY: 385,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 1,
    y: 0,
    centerOffsetX: 165,
    centerOffsetY: 55,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 1,
    y: 1,
    centerOffsetX: 165,
    centerOffsetY: 165,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 1,
    y: 2,
    centerOffsetX: 165,
    centerOffsetY: 275,
    card: { name: '狮', displayName: '🦁', level: 6, camp: 'Orc' },
  },
  {
    x: 1,
    y: 3,
    centerOffsetX: 165,
    centerOffsetY: 385,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 2,
    y: 0,
    centerOffsetX: 275,
    centerOffsetY: 55,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 2,
    y: 1,
    centerOffsetX: 275,
    centerOffsetY: 165,
    card: { name: '豹', displayName: '🐆', level: 4, camp: 'Alliance' },
  },
  {
    x: 2,
    y: 2,
    centerOffsetX: 275,
    centerOffsetY: 275,
    card: { name: '狼', displayName: '🐺', level: 3, camp: 'Orc' },
  },
  {
    x: 2,
    y: 3,
    centerOffsetX: 275,
    centerOffsetY: 385,
    card: { name: '狼', displayName: '🐺', level: 3, camp: 'Alliance' },
  },
  {
    x: 3,
    y: 0,
    centerOffsetX: 385,
    centerOffsetY: 55,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 3,
    y: 1,
    centerOffsetX: 385,
    centerOffsetY: 165,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 3,
    y: 2,
    centerOffsetX: 385,
    centerOffsetY: 275,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
  {
    x: 3,
    y: 3,
    centerOffsetX: 385,
    centerOffsetY: 385,
    card: { name: '', displayName: '', level: 0, camp: 'Unknow' },
  },
];

interface UseAnimalCardsParams {
  identity: Camp;
}

const useAnimalGrid: any = ({ identity: currentIdentity }: UseAnimalCardsParams) => {
  const [canvasEl, { gridLayer, cardLayer, operationLayer }] = usePaperLayer();
  const [cardAreaInfoArr, setCardAreaInfoArr] = useState<ReturnType<typeof createCardAreaInfoArr>>(
    initCardAreaInfoArr as any,
  );

  useAnimalCards({
    cardAreaInfoArr,
    cardLayer,
  });

  const { getCard } = useDealCards();

  const { getCardInfoByLocation, computedCardInfoByLocation } = useAnimalTools({
    cardAreaInfoArr,
  });

  const [activeArea, setActiveArea] = useState<CardLocationInfo | undefined>();
  const [hoverArea, setHoverArea] = useState<CardLocationInfo | undefined>();

  useEffect(() => {
    if (!activeArea) return;

    const cardAreaInfo = getCardInfoByLocation(activeArea);
    if (cardAreaInfo.card && cardAreaInfo.card.camp !== currentIdentity) {
      setActiveArea(undefined);
    }
  }, [activeArea, currentIdentity, cardAreaInfoArr, getCardInfoByLocation]);

  useEffect(() => {
    const pathArr = [
      { location: activeArea, color: animalLayoutColor.activeBorderColor },
      {
        location: hoverArea,
        color: animalLayoutColor.hoverBorderColor,
      },
    ].map((item) => {
      if (item.location) {
        operationLayer?.activate();
        return drawActiveBorder({
          location: item.location,
          color: new paper.Color(item.color),
          cardAreaInfoArr,
          cardAreaSize: animalLayoutSize.cardAreaSize,
        });
      }
      return undefined;
    });

    return () => {
      pathArr.forEach((item) => item?.remove());
    };
  }, [operationLayer, activeArea, hoverArea, cardAreaInfoArr]);

  useEffect(() => {
    // setCardAreaInfoArr((data) => fillCards(data));
  }, []);

  const turnOverCard = useCallback(
    (locationInfo: CardLocationInfo) => {
      const cardAreaInfo = getCardInfoByLocation(locationInfo);
      if (!cardAreaInfo?.card) return undefined;
      const cardInfo = getCard();
      if (!cardInfo) return undefined;

      const newCardAreaInfoArr = computedCardInfoByLocation(locationInfo, {
        ...cardInfo,
      });

      setCardAreaInfoArr(newCardAreaInfoArr);
      setActiveArea(undefined);
      return undefined;
    },
    [getCardInfoByLocation, computedCardInfoByLocation, setCardAreaInfoArr, getCard],
  );

  const onCardAreaMouseEnter = useEventCallback((location: CardLocationInfo) => {
    setHoverArea((pre) => {
      if (!pre) return location;
      if (locationEqual(pre, location)) {
        return pre;
      }
      return location;
    });
  }, []);

  const onCardAreaMouseLeave = useEventCallback(() => {
    setHoverArea(undefined);
  }, []);

  const moveCard = useCallback(
    (
      originLocation: CardLocationInfo,
      targetLocation: CardLocationInfo,
      format: (cardAreaInfo: CardAreaInfo) => CardAreaInfo = (v) => v,
    ) => {
      const originCardAreaInfo = getCardInfoByLocation(originLocation);
      setCardAreaInfoArr((pre) => {
        return pre.map((item) => {
          if (locationEqual(item, originLocation)) {
            return format({ ...item, card: null });
          }

          if (locationEqual(item, targetLocation)) {
            return format({ ...item, card: originCardAreaInfo.card });
          }

          return format(item);
        });
      });
      setActiveArea(undefined);
    },
    [getCardInfoByLocation],
  );

  const attackCard = useCallback(
    (originLocation: CardLocationInfo, targetLocation: CardLocationInfo) => {
      const originCardAreaInfo = getCardInfoByLocation(originLocation);
      const targetCardAreaInfo = getCardInfoByLocation(targetLocation);

      const fightResult = fight(originCardAreaInfo.card!.level, targetCardAreaInfo.card!.level);

      const logicMap: Record<typeof fightResult, Function> = {
        equalize: () => {
          moveCard(originLocation, targetLocation, (v) => {
            if (locationEqual(v, targetLocation)) {
              return { ...v, card: null };
            }
            return v;
          });
        },
        win: () => {
          moveCard(originLocation, targetLocation);
        },
        lose: () => {
          alert('无法进攻比自己厉害的动物');
        },
      };

      return logicMap[fightResult]();
    },
    [moveCard, getCardInfoByLocation],
  );

  const handleOperaCard = useCallback(
    (type: 'move' | 'attack', originLocation, targetLocation) => {
      const map = {
        move: moveCard,
        attack: attackCard,
      };
      if (canMove(originLocation, targetLocation)) {
        map[type](originLocation, targetLocation);
      } else {
        alert('你的跨度太大了');
      }
    },
    [attackCard, moveCard],
  );

  const onCardAreaMouseClick = useEventCallback(
    (locationInfo: CardLocationInfo) => {
      // 此处决定是 选择， 翻牌，移动，进攻。
      const { card } = getCardInfoByLocation(locationInfo);
      if (!activeArea && (card?.camp ?? Camp.Unknow) !== Camp.Unknow) {
        setActiveArea(locationInfo);
        return;
      }

      if (card && card.camp === Camp.Unknow) {
        // 翻牌
        turnOverCard(locationInfo);
        return;
      }

      if (activeArea) {
        if (locationEqual(activeArea, locationInfo)) {
          setActiveArea(undefined);
          return;
        }

        const activeAreaCardInfo = getCardInfoByLocation(activeArea);
        if (!activeAreaCardInfo.card || isEnemy(currentIdentity, activeAreaCardInfo.card.camp)) {
          setActiveArea(locationInfo);
          return;
        }

        if (card) {
          // 进攻
          if (!isEnemy(currentIdentity, card.camp)) {
            setActiveArea(locationInfo);
            return;
          }
          handleOperaCard('attack', activeArea, locationInfo);
        } else {
          // 移动
          handleOperaCard('move', activeArea, locationInfo);
        }
      }
    },
    [turnOverCard, activeArea, handleOperaCard, currentIdentity],
  );

  const drawGridByLayoutSize = useEventCallback(() => {
    gridLayer?.activate();
    return drawGrid({ ...animalLayoutSize });
  }, [gridLayer]);

  const drawCardAreaByLayoutSize = useEventCallback(() => {
    operationLayer?.activate();
    return drawCardArea({
      cardAreaInfoArr,
      cardAreaSize: animalLayoutSize.cardAreaSize,
      onCardAreaMouseEnter,
      onCardAreaMouseLeave,
      onCardAreaMouseClick,
    });
  }, [
    cardAreaInfoArr,
    operationLayer,
    onCardAreaMouseEnter,
    onCardAreaMouseLeave,
    onCardAreaMouseClick,
  ]);

  const setup = useEventCallback(() => {
    return drawGridByLayoutSize().concat(drawCardAreaByLayoutSize());
  }, [drawGridByLayoutSize, drawCardAreaByLayoutSize]);

  const canvasElement = canvasEl.current;

  useEffect(() => {
    if (canvasElement) {
      const pathArr = setup();
      return () => {
        pathArr.forEach((item) => item.remove());
      };
    }
    return () => {};
  }, [canvasElement, setup]);

  return [canvasEl];
};

export default useAnimalGrid;
