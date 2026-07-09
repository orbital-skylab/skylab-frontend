export const transformTabNameIntoId = (label: string) => {
  return label.replace(/\s/g, "-").toLowerCase() + "-tab";
};

export const getTabFromQuery = <T extends string>(
  tab: string | string[] | undefined,
  tabQueryValues: Record<T, string>,
  fallbackTab: T
) => {
  const queryValue = Array.isArray(tab) ? tab[0] : tab;
  const matchingTab = (Object.keys(tabQueryValues) as T[]).find(
    (key) => tabQueryValues[key] === queryValue
  );

  return matchingTab ?? fallbackTab;
};
