/**
 * Splits a phrase into words based on the capitalization.
 * @param {string} phrase Phrase to be split
 * @returns {string} Split words
 */
export const splitOnCapital = (phrase: string) =>
  phrase.split(/(?=[A-Z])/).join(" ");

/**
 * Splits a phrase into words based on hyphen, capitalizes the first letter of each word.
 * Full capitalizes any provided acronyms
 * @param {string} phrase Phrase to be split
 * @param {string[]} acronyms Acronyms to be capitalized
 * @returns {string} Split worsd
 */
export const splitOnHyphen = (phrase: string, acronyms?: string[]) => {
  const lowerCasedAcronyms =
    acronyms?.map((acronym) => acronym.toLowerCase()) ?? [];

  return phrase
    .split("-")
    .filter((word) => !!word)
    .map((chars) => {
      if (acronyms && lowerCasedAcronyms.includes(chars.toLowerCase())) {
        return chars.toUpperCase();
      } else {
        return chars.charAt(0).toUpperCase() + chars.slice(1);
      }
    })
    .join(" ");
};

export const validateUrl = (url: string) =>
  new RegExp(/^(ftp|http|https):\/\/[^ "]+$/).test(url);
