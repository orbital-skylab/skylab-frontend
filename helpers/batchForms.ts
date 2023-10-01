import { WithDescriptionExampleValidator } from "@/types/batchForms";

/**
 * Constants
 */
export const ACCEPTED_FILE_TYPES = ["text/csv"];

/**
 * Util functions
 */
export const checkValidity = (
  parsedData: unknown[],
  expectedHeaders: string[],
  csvDescription: WithDescriptionExampleValidator<string>
): { isValid: boolean; errorMessage?: string } => {
  if (!parsedData || !parsedData.length) {
    return {
      isValid: false,
      errorMessage: "No data was detected. Please upload another file.",
    };
  }

  if (typeof parsedData[0] !== "object") {
    return {
      isValid: false,
      errorMessage: "The detected file is not in the correct format.",
    };
  }

  const missingHeaders = listMissingHeaders(parsedData, expectedHeaders);
  if (missingHeaders.length !== 0) {
    return {
      isValid: false,
      errorMessage: `The uploaded file does not follow the format of the provided CSV template.\n\nThe following data fields were missing:\n${missingHeaders
        .map((header) => `• ${header}\n`)
        .join("")}\nPlease upload another file and try again.`,
    };
  }

  const extraHeaders = listExtraHeaders(parsedData, expectedHeaders);
  if (extraHeaders.length !== 0) {
    return {
      isValid: false,
      errorMessage: `The uploaded file does not follow the format of the provided CSV template.\n\nThe following extra data fields were included:\n${extraHeaders
        .map((header) => `• ${header}\n`)
        .join("")}\nPlease upload another file and try again.`,
    };
  }

  const allRowErrors: Record<string, string[]> = {};
  for (let rowIdx = 0; rowIdx < parsedData.length; rowIdx++) {
    const row = parsedData[rowIdx];
    const rowHeaderValues = Object.entries(row as Record<string, string>);

    const rowErrors = [];
    for (const [header, value] of rowHeaderValues) {
      const validator = csvDescription[header].validator;
      const isValid = validator(value);

      if (typeof isValid === "string") {
        rowErrors.push(isValid);
      }
    }

    if (rowErrors.length !== 0) {
      allRowErrors[`${rowIdx + 2}`] = rowErrors;
    }
  }

  if (Object.keys(allRowErrors).length !== 0) {
    return {
      isValid: false,
      errorMessage: `${
        parsedData.length
      } teams were detected.\n\nSome errors were detected while validating the data entries:\n${Object.entries(
        allRowErrors
      ).map(
        ([rowNumber, errors]) =>
          `• Row ${rowNumber}:\n${errors
            .map((error) => `    ○ ${error}`)
            .join("\n")}`
      )}`,
    };
  }

  return {
    isValid: true,
  };
};

export const listMissingHeaders = (
  parsedData: unknown[],
  expectedHeaders: string[]
) => {
  const detectedHeaders = new Set(
    Object.keys(parsedData[0] as Record<string, unknown>)
  );
  const missingHeaders = [];

  for (const header of expectedHeaders) {
    if (!detectedHeaders.has(header)) {
      missingHeaders.push(header);
    }
  }

  return missingHeaders;
};

export const listExtraHeaders = (
  parsedData: unknown[],
  expectedHeaders: string[]
) => {
  const expectedHeadersSet = new Set(expectedHeaders);
  const detectedHeaders = Object.keys(parsedData[0] as Record<string, unknown>);

  const extraHeaders = [];

  for (const header of detectedHeaders) {
    if (!expectedHeadersSet.has(header)) {
      extraHeaders.push(header);
    }
  }

  return extraHeaders;
};
