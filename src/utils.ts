export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const picked = {} as Pick<T, K>;
  for (const key of keys) {
    picked[key] = obj[key];
  }
  return picked;
};
