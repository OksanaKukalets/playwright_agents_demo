import { OpenWeatherEndpoints } from "./pathnames.js";

/**
 * Enhanced data and methods for Current Weather API edge case tests
 */

export class EnhancedWeatherApiData {
  weatherRequest = async (request, baseUrl, param) => {
    return await request.get(
      `${baseUrl}${OpenWeatherEndpoints.currentWeather}`,
      {
        params: {
          ...param,
          appid: process.env.APIKEY,
        },
      }
    );
  };

  static invalidCityTestData = {
    malformedWithSpecialChars: "Kyiv@#$%^&*()",
    extremelyLongCity: "A".repeat(1001), // 1001 characters
    emptyString: "",
    sqlInjectionAttempt: "'; DROP TABLE cities; --",
    xssAttempt: "<script>alert('xss')</script>",
    unicodeSpecialChars: "Kyiv\u0000\u0001\u0002",
    onlySpecialChars: "!@#$%^&*()",
    numbersOnly: "12345",
    mixedSpecialAndNumbers: "City123!@#",
  };

  static expectedResponses = {
    cityNotFound: {
      cod: "404",
      message: "city not found",
    },
    badRequest: {
      cod: "400",
      message: "Nothing to geocode",
    },
    invalidApiKey: {
      cod: 401,
      message:
        "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.",
    },
  };
}
