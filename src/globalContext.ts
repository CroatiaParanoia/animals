import React from 'react';

interface ContextValue {
  name: string;
  age: number;
  skill: string[];
  setContextValue: React.SetStateAction<Omit<ContextValue, 'setContextValue'>>;
}

export const defaultContextValue: ContextValue = {
  name: 'croatia',
  age: 22,
  skill: ['react', 'typescript', 'react-hooks'],
  setContextValue() {
    return defaultContextValue;
  },
};

export default React.createContext(defaultContextValue);
