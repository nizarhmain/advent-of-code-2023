// creates a range with a starting point
export const arrayRange = (start: number, stop: number, step: number) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step,
  );

export const isSymbol = (s: string) =>
  (!isNaN(Number(s)) || s !== ".") && s !== undefined;
