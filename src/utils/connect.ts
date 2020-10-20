import React from 'react';
import { pick, omit } from './utils';

const keysType = Symbol('pick-type');

type ContextValue = Record<string, any>;
type MapContextValueToProps<T> = (ctxValue: T) => any;

type ContextKeySelector<T> = {
  keys: (keyof T)[];
  [keysType]: 'pick' | 'omit';
};

export const pickContextValue = <T extends ContextValue>(
  ...args: (keyof T)[]
): ContextKeySelector<T> => {
  return {
    keys: args,
    [keysType]: 'pick',
  };
};

export const omitContextValue = <T extends ContextValue>(
  ...args: (keyof T)[]
): ContextKeySelector<T> => {
  return {
    keys: args,
    [keysType]: 'omit',
  };
};

const getSelectedContextValues = <T>(
  value: T,
  params?: MapContextValueToProps<T> | ContextKeySelector<T>,
) => {
  if (!params) return value;
  if (typeof params === 'function') {
    return params(value);
  }

  if (params[keysType] === 'pick') {
    return pick(value, ...params.keys);
  }

  return omit(value, ...params.keys);
};

function connect<T extends ContextValue>(
  ctx: React.Context<T>,
  params?: MapContextValueToProps<T> | ContextKeySelector<T>,
) {
  return <K>(fc: React.FC<K>) => {
    const tempFc = React.memo((props: K) => {
      return React.createElement(fc, props);
    });

    return React.memo((props: K) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const contextValue = React.useContext(ctx);

      const partCtxValue = getSelectedContextValues(contextValue, params);

      return React.createElement(tempFc, { ...props, ...partCtxValue });
    });
  };
}

export default connect;
