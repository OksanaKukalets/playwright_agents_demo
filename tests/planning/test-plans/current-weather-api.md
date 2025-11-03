# Current Weather API Test Plan

## Application Overview

The Current Weather API is part of the OpenWeather API suite, providing real-time weather data for various locations. The API endpoint being tested is `/data/2.5/weather` which supports different query parameters for location specification.

### Key Features Tested:

- Authentication validation
- Weather data retrieval by different location identifiers:
  - City name
  - ZIP code
  - City ID
- Response status code validation
- Response payload validation

## Test Environment

- **Base URL**: https://api.openweathermap.org
- **API Version**: 2.5
- **Authentication**: API Key required (stored in environment variables)

## Test Scenarios

### 1. Authentication Validation

#### 1.1 Unauthorized Access Attempt

**Priority**: High  
**Type**: Negative

**Steps:**

1. Send GET request to `/data/2.5/weather` endpoint
2. Omit the API key from the request

**Expected Results:**

- Response status code should be 401 Unauthorized
- Response body should contain:
  ```json
  {
    "cod": 401,
    "message": "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info."
  }
  ```

### 2. Weather Data Retrieval by City Name

#### 2.1 Valid City Name Request

**Priority**: High  
**Type**: Positive

**Steps:**

1. Send GET request to `/data/2.5/weather` endpoint
2. Include valid API key
3. Set query parameter `q=Kyiv`

**Expected Results:**

- Response status code should be 200 OK
- Response body should contain:
  - `sys.country` should be "UA"
  - `name` should be "Kyiv"
- Weather data should be present and valid

### 3. Weather Data Retrieval by ZIP Code

#### 3.1 Valid ZIP Code Request

**Priority**: High  
**Type**: Positive

**Steps:**

1. Send GET request to `/data/2.5/weather` endpoint
2. Include valid API key
3. Set query parameter `zip=94040,us`

**Expected Results:**

- Response status code should be 200 OK
- Response body should contain:
  - `sys.country` should be "US"
  - `name` should be "Mountain View"
- Weather data should be present and valid

### 4. Weather Data Retrieval by City ID

#### 4.1 Valid City ID Request

**Priority**: High  
**Type**: Positive

**Steps:**

1. Send GET request to `/data/2.5/weather` endpoint
2. Include valid API key
3. Set query parameter `id=2172797`

**Expected Results:**

- Response status code should be 200 OK
- Response body should contain:
  - `sys.country` should be "AU"
  - `name` should be "Cairns"
- Weather data should be present and valid

## Additional Test Considerations

### Future Test Cases to Consider:

1. **Invalid Location Parameters**

   - Non-existent city names
   - Invalid ZIP codes
   - Invalid city IDs

2. **API Rate Limiting**

   - Test behavior when rate limit is exceeded

3. **Response Format Validation**

   - Verify all required fields are present
   - Validate data types of all fields
   - Check units of measurement

4. **Error Handling**
   - Malformed requests
   - Invalid parameter combinations
   - Network timeout scenarios

## Test Data

### Test Cities

- Kyiv, Ukraine (Primary test city)
- Mountain View, US (ZIP code test)
- Cairns, Australia (City ID test)

### Status Codes

- 200: Successful request
- 401: Unauthorized

## Prerequisites

1. Valid API key stored in environment variables
2. Network access to api.openweathermap.org
3. Playwright test framework setup
4. Required test data files:
   - `constants.js`
   - `pathnames.js`
   - `weather-api-data.js`
