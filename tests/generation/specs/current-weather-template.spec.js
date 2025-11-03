import { test, expect } from "@playwright/test";
import { STATUS_CODES } from "../../planning/data/constants.js";
import { CurrentWeatherApiData } from "../../planning/data/weather-api-data.js";
import { OpenWeatherEndpoints } from "../../planning/data/pathnames.js";

const BASE_URL = "https://api.openweathermap.org";
const currentWeatherApiData = new CurrentWeatherApiData();

test.describe("Currect weather API tests", () => {
  test("should return 401 Unathorized error without the API key", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}${OpenWeatherEndpoints.currentWeather}`
    );

    expect(response.status()).toBe(STATUS_CODES.UNATHORIZED);

    const responseBody = await response.json();
    expect(responseBody, "responseBody").toEqual(
      CurrentWeatherApiData.invalidApiKeyResponse
    );
  });

  test("should check the 200 OK response with valid response for the specified city", async ({
    request,
  }) => {
    const response = await currentWeatherApiData.weatherRequest(
      request,
      BASE_URL,
      {
        q: CurrentWeatherApiData.testingParams.city,
      }
    );

    expect(response.status()).toBe(STATUS_CODES.OK);

    const responseBody = await response.json();
    expect(responseBody.sys.country, "responseBody.sys.country").toEqual("UA");
    expect(responseBody.name, "responseBody.name").toEqual("Kyiv");
  });

  test("should check the 200 OK response with valid response for the zip code", async ({
    request,
  }) => {
    const response = await currentWeatherApiData.weatherRequest(
      request,
      BASE_URL,
      {
        zip: CurrentWeatherApiData.testingParams.zip,
      }
    );

    expect(response.status()).toBe(STATUS_CODES.OK);

    const responseBody = await response.json();
    expect(responseBody.sys.country, "responseBody.sys.country").toEqual("US");
    expect(responseBody.name, "responseBody.name").toEqual("Mountain View");
  });

  test("should check the 200 OK response with valid response for the city ID", async ({
    request,
  }) => {
    const response = await currentWeatherApiData.weatherRequest(
      request,
      BASE_URL,
      {
        id: CurrentWeatherApiData.testingParams.id,
      }
    );

    expect(response.status()).toBe(STATUS_CODES.OK);

    const responseBody = await response.json();
    expect(responseBody.sys.country, "responseBody.sys.country").toEqual("AU");
    expect(responseBody.name, "responseBody.name").toEqual("Cairns");
  });
});
