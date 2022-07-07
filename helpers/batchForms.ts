export const checkValidity = (
  parsedData: unknown[],
  expectedHeaders: string[]
): { isValid: boolean; errorMessage?: string } => {
  let rowsWithNull;

  if (!parsedData || !parsedData.length) {
    return {
      isValid: false,
      errorMessage: "No data was detected. Please upload another file.",
    };
  } else if (!checkHeadersMatch(parsedData, expectedHeaders)) {
    return {
      isValid: false,
      errorMessage:
        "The detected file does not follow the format of the provided CSV template. Please upload another file or try again.",
    };
  } else if ((rowsWithNull = findRowsWithNull(parsedData)).length !== 0) {
    return {
      isValid: false,
      errorMessage: `The detected file contains rows with incomplete data (Rows: ${rowsWithNull.join(
        ", "
      )}) Please check the file and try again.`,
    };
  } else {
    return {
      isValid: true,
    };
  }
};

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

export const findRowsWithNull = (parsedData: unknown[]) => {
  if (!parsedData.length || typeof parsedData[0] !== "object") {
    return [-1];
  }

  const rowsWithNull = [];
  console.log(parsedData);
  for (let i = 0; i < parsedData.length; i++) {
    const data = parsedData[i] as Record<string, unknown>;
    for (const value of Object.values(data)) {
      if (value === null) {
        rowsWithNull.push(i + 1);
        break;
      }
    }
  }

  return rowsWithNull;
};
