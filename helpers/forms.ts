export const stripEmptyStrings = (values: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== "")
  );
};

export const areAllEmptyValues = (values: Record<string, unknown>) => {
  if (!values) {
    return true;
  }

  return Boolean(Object.values(values).reduce((a, b) => a && b === "", true));
};

export const hasEmptyValues = (values: Record<string, unknown>) => {
  if (!values) {
    return true;
  }

  return Boolean(Object.values(values).reduce((a, b) => a || b === "", false));
};
