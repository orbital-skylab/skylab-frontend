export const splitOnCapital = (word: string) =>
  word.split(/(?=[A-Z])/).join(" ");
