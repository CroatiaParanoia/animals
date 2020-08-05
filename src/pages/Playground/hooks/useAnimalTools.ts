import { useCallback } from 'react';
import { CardAreaInfo, CardLocationInfo, CardInfo } from '../types';

interface UseAnimalToolsParams {
  cardAreaInfoArr: CardAreaInfo[];
}

interface UseAnimalToolsReturn {
  getCardInfoByLocation: (locationInfo: CardLocationInfo) => CardAreaInfo | undefined;
  computedCardInfoByLocation: (
    locationInfo: CardLocationInfo,
    cardInfo: CardInfo,
  ) => CardAreaInfo[];
}

const useAnimalTools = ({ cardAreaInfoArr }: UseAnimalToolsParams): UseAnimalToolsReturn => {
  const getCardInfoByLocation = useCallback<UseAnimalToolsReturn['getCardInfoByLocation']>(
    (locationInfo) => {
      const { x, y } = locationInfo;
      return cardAreaInfoArr.find((item) => {
        return item.x === x && item.y === y;
      });
    },
    [cardAreaInfoArr],
  );

  const computedCardInfoByLocation = useCallback<
    UseAnimalToolsReturn['computedCardInfoByLocation']
  >(
    (locationInfo, cardInfo) => {
      const { x, y } = locationInfo;
      return cardAreaInfoArr.map((item) => {
        if (item.x === x && item.y === y) {
          return {
            ...item,
            card: cardInfo,
          };
        }
        return item;
      });
    },
    [cardAreaInfoArr],
  );

  return {
    getCardInfoByLocation,
    computedCardInfoByLocation,
  };
};

export default useAnimalTools;
