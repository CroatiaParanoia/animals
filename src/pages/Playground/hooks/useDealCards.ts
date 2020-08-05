import { useRef, useCallback } from 'react';
import { CardInfo } from '../types';
import { generateCards } from '../utils/tools';

const useDealCards = () => {
  const subCards = useRef<CardInfo[]>(generateCards());

  const getCard = useCallback((): CardInfo | undefined => {
    return subCards.current.shift();
  }, []);

  const resetCards = useCallback(() => {
    subCards.current = generateCards();
  }, []);

  return {
    getCard,
    resetCards,
  };
};

export default useDealCards;
