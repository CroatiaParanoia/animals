import { useEffect, useCallback } from 'react';
import { CardAreaInfo } from '../types';
import {} from 'react-use';
import { drawCard } from '../utils/drawPolygon';

interface UseAnimalCardsParams {
  cardAreaInfoArr: CardAreaInfo[];
  cardLayer: paper.Layer | null;
}
const useAnimalCards = ({ cardAreaInfoArr, cardLayer }: UseAnimalCardsParams) => {
  const drawCards = useCallback(() => {
    const pathArr = cardAreaInfoArr.map((item) => {
      return drawCard({
        cardAreaInfo: item,
        cardSize: 30,
      });
    });
    return pathArr;
  }, [cardAreaInfoArr]);

  useEffect(() => {
    if (!cardLayer) return () => {};

    cardLayer?.activate();
    cardLayer?.removeChildren();
    const pathArr = drawCards();
    return () => {
      pathArr.forEach((v) => v?.remove());
    };
  }, [cardLayer, drawCards]);
};

export default useAnimalCards;
