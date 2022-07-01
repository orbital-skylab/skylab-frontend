export const splitOnCapital = (word: string) =>
  word.split(/(?=[A-Z])/).join(" ");

export const validateUrl = (url: string) =>
  new RegExp(/^(ftp|http|https):\/\/[^ "]+$/).test(url);
