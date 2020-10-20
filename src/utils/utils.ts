export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> => {
  return keys.reduce((res, item) => {
    return {
      ...res,
      [item]: obj[item],
    };
  }, {} as T);
};

export const omit = <T extends Record<string, any>, K extends keyof T>(obj: T, ...keys: K[]) => {
  const allowKeys = Object.keys(obj).filter((v) => !keys.includes(v as K)) as K[];

  return (pick(obj, ...allowKeys) as any) as Omit<T, K>;
};
