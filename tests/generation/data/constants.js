/**
 * Enhanced constants for generation tests including edge cases
 */

export const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
};

export const ERROR_MESSAGES = {
  INVALID_API_KEY:
    "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.",
  CITY_NOT_FOUND: "city not found",
  NOTHING_TO_GEOCODE: "Nothing to geocode",
};
