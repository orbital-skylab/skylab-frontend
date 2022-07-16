/**
 * Checks if a JavaScript date object is valid or not
 * @param {Date} date JavaScript date object to check
 * @returns {boolean}
 */
export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.valueOf());
};

/**
 * Formats an ISO 8601 date format for viewing date and time
 * @param {string} isoDate Date in ISO 8601 string format
 * @returns {string} Date formatted as DD/MM/YYYY, HH:MM
 */
export const isoDateToLocaleDateWithTime = (isoDate: string) => {
  const date = new Date(isoDate);

  if (!isValidDate(date)) {
    return "An invalid date was provided";
  }

  return date.toLocaleString().slice(0, 17);
};

/**
 * Formats an ISO 8601 date format for usage with type='datetime-local' input
 * @param {string} isoDate Date in ISO 8601 string format
 * @param {number} offset The number of minutes to offset from UTC time (eg. GMT +8 is 480)
 * @returns {string} Date formatted for usage with type='datetime-local' input
 */
export const isoDateToDateTimeLocalInput = (
  isoDate: string | undefined,
  offset = 480
) => {
  if (!isoDate) {
    return "";
  }

  const d = new Date(new Date(isoDate).getTime() + offset * 60000);
  const formattedDate = d.toISOString().slice(0, 16);

  return formattedDate;
};

/**
 * Formats a date format used with a type='datetime-local' input to ISO 8601
 * @param {string} dateTimeLocalInput Date in `YYYY-MM-DDTHH:MM` format
 * @returns {string} ISO 8601 Date
 */
export const dateTimeLocalInputToIsoDate = (
  dateTimeLocalInput: string | undefined
) => {
  if (!dateTimeLocalInput) {
    return "";
  }
  const date = new Date(dateTimeLocalInput);

  if (!isValidDate(date)) {
    return "";
  }

  return date.toISOString();
};

/**
 * Gets today's date (GMT+8) while setting the time to a specific hour and minute in ISO 8601 format
 * @param {number} hours Hour to set
 * @param {number} minutes Minutes to eet
 * @returns {string} ISO 8601 Date
 */
export const getTodayAtTimeIso = (hours: number, minutes?: number) => {
  const today = new Date();
  today.setHours(hours, minutes);
  return today.toISOString();
};
