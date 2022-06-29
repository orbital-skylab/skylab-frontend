export const checkHeadersMatch = (
  parsedData: unknown[],
  actualHeaders: string[]
) => {
  if (!parsedData.length || typeof parsedData[0] !== "object") {
    return false;
  }

  const detectedHeaders = Object.keys(parsedData[0] as Record<string, unknown>);

  if (actualHeaders.length !== detectedHeaders.length) {
    return false;
  }

  const set = new Set(detectedHeaders);
  actualHeaders.forEach((header) => {
    if (!set.has(header)) {
      return false;
    }
  });

  return true;
};
