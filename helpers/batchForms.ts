export const checkValidity = (
  parsedData: unknown[],
  expectedHeaders: string[]
): { isValid: boolean; errorMessage?: string } => {
  let rowsWithNull;
  let rowsWithInvalidEmail;
  let rowsWithInvalidNusnetId;
  let rowsWithInvalidMatriculationNumber;

  if (!parsedData || !parsedData.length) {
    return {
      isValid: false,
      errorMessage: "No data was detected. Please upload another file.",
    };
  }

  if (!checkHeadersMatch(parsedData, expectedHeaders)) {
    return {
      isValid: false,
      errorMessage:
        "The detected file does not follow the format of the provided CSV template. Please upload another file or try again.",
    };
  }

  if ((rowsWithNull = findRowsWithNull(parsedData)).length !== 0) {
    return {
      isValid: false,
      errorMessage: `The detected file contains rows with incomplete data (Rows: ${rowsWithNull.join(
        ", "
      )}) Please check the file and try again.`,
    };
  }

  if (
    (rowsWithInvalidEmail = findRowsWithInvalidEmail(parsedData)).length !== 0
  ) {
    return {
      isValid: false,
      errorMessage: `The detected file contains rows with invalid email (Rows: ${rowsWithInvalidEmail.join(
        ", "
      )}) Please check the file and try again.`,
    };
  }

  if (
    (rowsWithInvalidNusnetId = findRowsWithInvalidNusnetId(parsedData))
      .length !== 0
  ) {
    return {
      isValid: false,
      errorMessage: `The detected file contains rows with invalid NUSNET ID (Rows: ${rowsWithInvalidNusnetId.join(
        ", "
      )}) Please check the file and try again.`,
    };
  }

  if (
    (rowsWithInvalidMatriculationNumber =
      findRowsWithInvalidMatriculationNumber(parsedData)).length !== 0
  ) {
    return {
      isValid: false,
      errorMessage: `The detected file contains rows with invalid matriculation number (Rows: ${rowsWithInvalidMatriculationNumber.join(
        ", "
      )}) Please check the file and try again.`,
    };
  }

  return {
    isValid: true,
  };
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

const findRowsWithInvalidEmail = (parsedData: unknown[]) => {
  const rowsWithInvalidEmail = [];
  const emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  for (let i = 0; i < parsedData.length; i++) {
    const data = parsedData[i] as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (key.includes("Email") && !emailPattern.test(value as string)) {
        rowsWithInvalidEmail.push(i + 1);
        break;
      }
    }
  }

  return rowsWithInvalidEmail;
};

const findRowsWithInvalidNusnetId = (parsedData: unknown[]) => {
  const rowsWithInvalidNusnetId = [];
  const nusnetIdPattern = /^(e)[0-9]{7}$/;
  console.log(parsedData);
  for (let i = 0; i < parsedData.length; i++) {
    const data = parsedData[i] as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (key.includes("NUSNET ID") && !nusnetIdPattern.test(value as string)) {
        rowsWithInvalidNusnetId.push(i + 1);
        break;
      }
    }
  }

  return rowsWithInvalidNusnetId;
};

const findRowsWithInvalidMatriculationNumber = (parsedData: unknown[]) => {
  const rowsWithInvalidMatriculationNumber = [];
  const matriculationNumberPattern = /^(A)[0-9]{7}[A-Z]$/;
  console.log(parsedData);
  for (let i = 0; i < parsedData.length; i++) {
    const data = parsedData[i] as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (
        key.includes("Matriculation Number") &&
        !matriculationNumberPattern.test(value as string)
      ) {
        rowsWithInvalidMatriculationNumber.push(i + 1);
        break;
      }
    }
  }

  return rowsWithInvalidMatriculationNumber;
};
