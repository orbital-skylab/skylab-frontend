export const toSingleLineCsvText = (value?: string | null) =>
  (value ?? "").replace(/\r\n|\r|\n/g, " ");
