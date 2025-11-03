import { test, expect } from "@playwright/test";
import {
  STATUS_CODES,
  ERROR_MESSAGES,
} from "../../generation/data/constants.js";
import { EnhancedWeatherApiData } from "../../generation/data/weather-api-data.js";

const BASE_URL = "https://api.openweathermap.org";
const weatherApiData = new EnhancedWeatherApiData();

test.describe("Invalid City Names", () => {
  test("XSS attempts in city names", async ({ request }) => {
    // Test malformed city names with XSS attempt
    const response = await weatherApiData.weatherRequest(request, BASE_URL, {
      q: EnhancedWeatherApiData.invalidCityTestData.xssAttempt,
    });

    expect(response.status()).toBe(STATUS_CODES.NOT_FOUND);

    const responseBody = await response.json();
    expect(responseBody.cod, "Response code should be 404").toBe("404");
    expect(responseBody.message, "Should return city not found message").toBe(
      ERROR_MESSAGES.CITY_NOT_FOUND
    );
  });

  test("SQL injection attempts in city names", async ({ request }) => {
    // Test malformed city names with SQL injection attempt
    const response = await weatherApiData.weatherRequest(request, BASE_URL, {
      q: EnhancedWeatherApiData.invalidCityTestData.sqlInjectionAttempt,
    });

    expect(response.status()).toBe(STATUS_CODES.NOT_FOUND);

    const responseBody = await response.json();
    expect(responseBody.cod, "Response code should be 404").toBe("404");
    expect(responseBody.message, "Should return city not found message").toBe(
      ERROR_MESSAGES.CITY_NOT_FOUND
    );
  });

  test("City names with special characters", async ({ request }) => {
    // Test malformed city names with special characters
    const response = await weatherApiData.weatherRequest(request, BASE_URL, {
      q: EnhancedWeatherApiData.invalidCityTestData.malformedWithSpecialChars,
    });

    expect(response.status()).toBe(STATUS_CODES.NOT_FOUND);

    const responseBody = await response.json();
    expect(responseBody.cod, "Response code should be 404").toBe("404");
    expect(responseBody.message, "Should return city not found message").toBe(
      ERROR_MESSAGES.CITY_NOT_FOUND
    );
  });

  test("Extremely long city names with special characters", async ({
    request,
  }) => {
    // Test extremely long city names (boundary testing)
    const response = await weatherApiData.weatherRequest(request, BASE_URL, {
      q: EnhancedWeatherApiData.invalidCityTestData.extremelyLongCity,
    });

    // API might return 404 or 400 depending on implementation
    expect([STATUS_CODES.BAD_REQUEST, STATUS_CODES.NOT_FOUND]).toContain(
      response.status()
    );

    const responseBody = await response.json();
    expect(responseBody.cod, "Response should have error code").toBeTruthy();
    expect(responseBody.message, "Should have error message").toBeTruthy();
  });

  test("Empty city name parameter", async ({ request }) => {
    // Test empty city name parameter
    const response = await weatherApiData.weatherRequest(request, BASE_URL, {
      q: EnhancedWeatherApiData.invalidCityTestData.emptyString,
    });

    expect(response.status()).toBe(STATUS_CODES.BAD_REQUEST);

    const responseBody = await response.json();
    expect(responseBody.cod, "Response code should be 400").toBe("400");
    expect(
      responseBody.message,
      "Should return nothing to geocode message"
    ).toBe(ERROR_MESSAGES.NOTHING_TO_GEOCODE);
  });

  test("Unicode special character combinations", async ({ request }) => {
    // Test Unicode and special character combinations
    const response = await weatherApiData.weatherRequest(request, BASE_URL, {
      q: EnhancedWeatherApiData.invalidCityTestData.unicodeSpecialChars,
    });

    expect(response.status()).toBe(STATUS_CODES.NOT_FOUND);

    const responseBody = await response.json();
    expect(responseBody.cod, "Response code should be 404").toBe("404");
    expect(responseBody.message, "Should return city not found message").toBe(
      ERROR_MESSAGES.CITY_NOT_FOUND
    );
  });

  test("Only special characters as city name", async ({ request }) => {
    // Test city names with only special characters
    const response = await weatherApiData.weatherRequest(request, BASE_URL, {
      q: EnhancedWeatherApiData.invalidCityTestData.onlySpecialChars,
    });

    expect(response.status()).toBe(STATUS_CODES.NOT_FOUND);

    const responseBody = await response.json();
    expect(responseBody.cod, "Response code should be 404").toBe("404");
    expect(responseBody.message, "Should return city not found message").toBe(
      ERROR_MESSAGES.CITY_NOT_FOUND
    );
  });

  test("Numbers only as city name", async ({ request }) => {
    // Test city names with numbers only
    // Note: OpenWeatherMap API treats numeric strings as potential city IDs
    // so "12345" might return weather data if it matches an existing city ID
    const response = await weatherApiData.weatherRequest(request, BASE_URL, {
      q: EnhancedWeatherApiData.invalidCityTestData.numbersOnly,
    });

    // API might return 200 (if numeric string matches a city ID) or 404 (if not found)
    expect([STATUS_CODES.OK, STATUS_CODES.NOT_FOUND]).toContain(
      response.status()
    );

    const responseBody = await response.json();
    if (response.status() === STATUS_CODES.OK) {
      // If API returns 200, it found a city with this ID
      expect(responseBody.cod, "Response should have success code").toBe(200);
      expect(responseBody.name, "Should have city name").toBeTruthy();
    } else {
      // If API returns 404, the numeric string doesn't match any city ID
      expect(responseBody.cod, "Response code should be 404").toBe("404");
      expect(responseBody.message, "Should return city not found message").toBe(
        ERROR_MESSAGES.CITY_NOT_FOUND
      );
    }
  });

  test("Mixed special characters and numbers", async ({ request }) => {
    // Test city names with mixed special characters and numbers
    const response = await weatherApiData.weatherRequest(request, BASE_URL, {
      q: EnhancedWeatherApiData.invalidCityTestData.mixedSpecialAndNumbers,
    });

    expect(response.status()).toBe(STATUS_CODES.NOT_FOUND);

    const responseBody = await response.json();
    expect(responseBody.cod, "Response code should be 404").toBe("404");
    expect(responseBody.message, "Should return city not found message").toBe(
      ERROR_MESSAGES.CITY_NOT_FOUND
    );
  });
});
