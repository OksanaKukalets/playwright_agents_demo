import { OpenWeatherEndpoints } from "./pathnames.js";

/**
 * Data and methods for Current Weather API tests
 */

export class CurrentWeatherApiData {
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

  static invalidApiKeyResponse = {
    cod: 401,
    message:
      "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.",
  };

  static testingParams = {
    city: "Kyiv",
    zip: "94040,us",
    id: "2172797",
  };
}
