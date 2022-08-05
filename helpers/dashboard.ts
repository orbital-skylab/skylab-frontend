export const transformTabNameIntoId = (label: string) => {
  return label.replace(/\s/g, "-").toLowerCase() + "-tab";
};
