import { test, expect } from "@playwright/test";
import { STATUS_CODES } from "../../planning/data/constants.js";
import { CurrentWeatherApiData } from "../../planning/data/weather-api-data.js";
import { OpenWeatherEndpoints } from "../../planning/data/pathnames.js";

const BASE_URL = "https://api.openweathermap.org";
const currentWeatherApiData = new CurrentWeatherApiData();

// Add NOT_FOUND status code if not already defined
const EXTENDED_STATUS_CODES = {
  ...STATUS_CODES,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
};

test.describe("Invalid City Names - Malformed City Names with Special Characters", () => {
  test("Test malformed city names with special characters", async ({
    request,
  }) => {
    // 1. Send API request with city name containing special characters: q=Kyiv@#$%^&*()
    const responseWithSpecialChars = await currentWeatherApiData.weatherRequest(
      request,
      BASE_URL,
      {
        q: "Kyiv@#$%^&*()",
      }
    );

    // 2. Verify response returns 404 Not Found status code
    expect(responseWithSpecialChars.status()).toBe(
      EXTENDED_STATUS_CODES.NOT_FOUND
    );

    // 3. Verify error message is descriptive and informative
    const responseBodySpecialChars = await responseWithSpecialChars.json();
    expect(responseBodySpecialChars.cod).toBe(404);
    expect(responseBodySpecialChars.message).toContain("city not found");

    // 4. Send API request with city name containing only special characters: q=@#$%^&*()
    const responseOnlySpecialChars = await currentWeatherApiData.weatherRequest(
      request,
      BASE_URL,
      {
        q: "@#$%^&*()",
      }
    );

    // 5. Verify response returns 404 Not Found status code
    expect(responseOnlySpecialChars.status()).toBe(
      EXTENDED_STATUS_CODES.NOT_FOUND
    );

    // 6. Verify error message handles pure special character input appropriately
    const responseBodyOnlySpecialChars = await responseOnlySpecialChars.json();
    expect(responseBodyOnlySpecialChars.cod).toBe(404);
    expect(responseBodyOnlySpecialChars.message).toContain("city not found");

    // 7. Send API request with mixed valid city name and special characters: q=London@#$
    const responseMixedChars = await currentWeatherApiData.weatherRequest(
      request,
      BASE_URL,
      {
        q: "London@#$",
      }
    );

    // 8. Verify response returns 404 Not Found status code
    expect(responseMixedChars.status()).toBe(EXTENDED_STATUS_CODES.NOT_FOUND);

    // 9. Verify error message indicates city not found rather than parameter validation error
    const responseBodyMixedChars = await responseMixedChars.json();
    expect(responseBodyMixedChars.cod).toBe(404);
    expect(responseBodyMixedChars.message).toContain("city not found");

    // Additional verification: Ensure no sensitive information is exposed
    expect(responseBodyMixedChars).not.toHaveProperty("apikey");
    expect(responseBodyMixedChars).not.toHaveProperty("appid");
  });

  test("Test additional special character combinations", async ({
    request,
  }) => {
    // Test cases with various special character combinations
    const specialCharTestCases = [
      { input: "City!@#$%", description: "city name with symbols" },
      {
        input: "Test<>\"':;|\\",
        description: "city name with markup characters",
      },
      {
        input: "123@City&*",
        description: "city name with numbers and symbols",
      },
      { input: "    ", description: "city name with only spaces" },
      { input: "Город№123", description: "city name with unicode and symbols" },
    ];

    for (const testCase of specialCharTestCases) {
      // Send API request with special character combination
      const response = await currentWeatherApiData.weatherRequest(
        request,
        BASE_URL,
        {
          q: testCase.input,
        }
      );

      // Verify consistent error handling
      expect(
        response.status(),
        `Failed for ${testCase.description}: ${testCase.input}`
      ).toBe(EXTENDED_STATUS_CODES.NOT_FOUND);

      const responseBody = await response.json();
      expect(
        responseBody.cod,
        `Failed cod check for ${testCase.description}`
      ).toBe(404);
      expect(
        responseBody.message,
        `Failed message check for ${testCase.description}`
      ).toMatch(/city not found|not found/i);
    }
  });

  test("Test SQL injection and XSS attempts in city names", async ({
    request,
  }) => {
    // Test potential security vulnerabilities
    const securityTestCases = [
      "'; DROP TABLE cities; --",
      "<script>alert('xss')</script>",
      "City' OR '1'='1",
      'City"; DELETE FROM weather; --',
      "<img src=x onerror=alert(1)>",
    ];

    for (const maliciousInput of securityTestCases) {
      const response = await currentWeatherApiData.weatherRequest(
        request,
        BASE_URL,
        {
          q: maliciousInput,
        }
      );

      // Verify security: should return 404, not execute any malicious code
      expect(
        response.status(),
        `Security test failed for: ${maliciousInput}`
      ).toBe(EXTENDED_STATUS_CODES.NOT_FOUND);

      const responseBody = await response.json();
      expect(responseBody.cod).toBe(404);

      // Ensure the malicious input is not reflected back in a dangerous way
      expect(responseBody.message).not.toContain("<script>");
      expect(responseBody.message).not.toContain("DROP TABLE");
      expect(responseBody.message).not.toContain("DELETE FROM");
    }
  });
});
