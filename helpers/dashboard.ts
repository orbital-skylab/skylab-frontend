export const transformTabNameIntoId = (label: string) => {
  return label.replace(/\s/g, "-").toLowerCase() + "-tab";
};

export const getTabFromQuery = <T extends string>(
  tab: string | string[] | undefined,
  tabQueryValues: Record<T, string>,
  fallbackTab: T
) => {
  const queryValue = Array.isArray(tab) ? tab[0] : tab;
  const matchingTab = Object.entries(tabQueryValues).find(
    ([, tabQueryValue]) => tabQueryValue === queryValue
  );

  return (matchingTab?.[0] as T | undefined) ?? fallbackTab;
};
