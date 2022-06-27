import { HEADERS } from "./BatchAttachAdvisersForm.types";

/**
 * This maps the variable name (key) to the HEADER enum (value) used in the CSV template
 */
export const HEADER_MAPPING: Record<string, HEADERS> = {
  nusnetId: HEADERS.NUSNET_ID,
};
