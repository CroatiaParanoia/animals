import { useEffect, useCallback, useState } from 'react';

import paper from 'paper';

import useEventCallback from '../../../hooks/useEventCallback';
import { drawGrid, drawCardArea, drawActiveBorder } from '../utils/drawPolygon';
import { createCardAreaInfoArr, fillCards } from '../utils/tools';
import { CardLocationInfo } from '../types';

import { animalLayoutSize, animalLayoutColor } from '../config';

import useAnimalCards from './useAnimalCards';
import useAnimalTools from './useAnimalTools';
import usePaperLayer from './usePaperLayer';
import useDealCards from './useDealCards';

const initCardAreaInfoArr = createCardAreaInfoArr({
  ...animalLayoutSize,
});

const useAnimalGrid: any = () => {
  const [canvasEl, { gridLayer, cardLayer, operationLayer }] = usePaperLayer();
  // const canvasEl = useRef<HTMLCanvasElement>(null);

  const [activeArea, setActiveArea] = useState<CardLocationInfo | undefined>();
  const [hoverArea, setHoverArea] = useState<CardLocationInfo | undefined>();

  const [cardAreaInfoArr, setCardAreaInfoArr] = useState(initCardAreaInfoArr);

  useAnimalCards({
    cardAreaInfoArr,
    cardLayer,
  });

  const { getCard } = useDealCards();

  const { getCardInfoByLocation, computedCardInfoByLocation } = useAnimalTools({
    cardAreaInfoArr,
  });

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
  }, [operationLayer, activeArea, hoverArea]);

  useEffect(() => {
    setCardAreaInfoArr((data) => fillCards(data));
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

      return undefined;
    },
    [getCardInfoByLocation, computedCardInfoByLocation, setCardAreaInfoArr, getCard],
  );

  const onCardAreaMouseEnter = useEventCallback((locationInfo: CardLocationInfo) => {
    setHoverArea(locationInfo);
  }, []);

  const onCardAreaMouseLeave = useEventCallback(() => {
    setHoverArea(undefined);
  }, []);

  const onCardAreaMouseClick = useEventCallback(
    (locationInfo: CardLocationInfo) => {
      turnOverCard(locationInfo);

      setActiveArea(locationInfo);
    },
    [turnOverCard],
  );

  const drawGridByLayoutSize = useCallback(() => {
    gridLayer?.activate();
    return drawGrid({ ...animalLayoutSize });
  }, [gridLayer]);

  const drawCardAreaByLayoutSize = useCallback(() => {
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

  useEffect(() => {
    if (canvasEl.current) {
      const pathArr = setup();
      return () => {
        pathArr.forEach((item) => item.remove());
      };
    }
    return () => {};
  }, [canvasEl.current, setup]);

  return [canvasEl];
};

export default useAnimalGrid;
