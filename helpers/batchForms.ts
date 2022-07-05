/**
 * Checks whether the parsed data's headers matches the expected headers
 * @param parsedData The parsed data
 * @param expectedHeaders The expected data headers
 * @returns {boolean} Returns true if the headers match
 */
export const checkHeadersMatch = (
  parsedData: unknown[],
  expectedHeaders: string[]
) => {
  if (!parsedData.length || typeof parsedData[0] !== "object") {
    return false;
  }

  const detectedHeaders = Object.keys(parsedData[0] as Record<string, unknown>);

  if (expectedHeaders.length !== detectedHeaders.length) {
    return false;
  }

  const set = new Set(detectedHeaders);
  expectedHeaders.forEach((header) => {
    if (!set.has(header)) {
      return false;
    }
  });

  return true;
};
