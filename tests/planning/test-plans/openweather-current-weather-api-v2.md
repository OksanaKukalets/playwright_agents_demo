# OpenWeather Current Weather API - Comprehensive Test Plan

## Executive Summary

This test plan covers the OpenWeather Current Weather API (`/data/2.5/weather`) which provides real-time weather information for locations worldwide. The API supports multiple location identification methods including city name, ZIP code, and unique city ID. This plan ensures comprehensive validation of API functionality, error handling, authentication, and data integrity.

## API Overview

### Endpoint Details

- **Base URL**: `https://api.openweathermap.org`
- **Endpoint**: `/data/2.5/weather`
- **Method**: GET
- **Authentication**: API Key required (`appid` parameter)
- **Rate Limiting**: Subject to OpenWeather plan limits

### Supported Location Parameters

- `q` - City name (e.g., "London" or "London,UK")
- `zip` - ZIP/postal code with country (e.g., "94040,US")
- `id` - OpenWeather city ID (e.g., "2172797")
- `lat` & `lon` - Geographic coordinates
- `units` - Temperature units (metric, imperial, kelvin)

## Test Environment Setup

### Prerequisites

- Valid OpenWeather API key stored in `process.env.APIKEY`
- Playwright test framework configured
- Network access to `api.openweathermap.org`
- Test data files available in `/data/` directory

### Dependencies

- `@playwright/test` framework
- Test data classes: `CurrentWeatherApiData`
- Constants: `STATUS_CODES`, `OpenWeatherEndpoints`

## Test Scenarios

### 1. Authentication and Authorization

#### 1.1 Missing API Key Validation

**Priority**: Critical  
**Type**: Security/Negative Testing

**Preconditions**: None  
**Test Data**: No API key provided

**Steps:**

1. Send GET request to `/data/2.5/weather` endpoint
2. Include city query parameter `q=London`
3. Omit the `appid` parameter completely

**Expected Results:**

- HTTP Status: `401 Unauthorized`
- Response Content-Type: `application/json`
- Response body structure:
  ```json
  {
    "cod": 401,
    "message": "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info."
  }
  ```

**Success Criteria**: API correctly rejects unauthorized requests

#### 1.2 Invalid API Key Validation

**Priority**: High  
**Type**: Security/Negative Testing

**Steps:**

1. Send GET request with invalid API key
2. Set `appid=invalid_key_12345`
3. Include valid location parameter

**Expected Results:**

- HTTP Status: `401 Unauthorized`
- Error message indicating invalid API key

### 2. Location-Based Weather Retrieval

#### 2.1 Weather by City Name - Valid Request

**Priority**: Critical  
**Type**: Functional/Positive Testing

**Test Data**: City = "Kyiv"

**Steps:**

1. Send GET request to `/data/2.5/weather`
2. Include valid API key in `appid` parameter
3. Set query parameter `q=Kyiv`

**Expected Results:**

- HTTP Status: `200 OK`
- Response contains weather data for Kyiv, Ukraine
- Validation points:
  - `sys.country` equals "UA"
  - `name` equals "Kyiv"
  - `main.temp` is present and numeric
  - `weather[0].description` is present
  - `coord.lat` and `coord.lon` are present

#### 2.2 Weather by ZIP Code - Valid Request

**Priority**: Critical  
**Type**: Functional/Positive Testing

**Test Data**: ZIP = "94040,US"

**Steps:**

1. Send GET request to `/data/2.5/weather`
2. Include valid API key in `appid` parameter
3. Set query parameter `zip=94040,US`

**Expected Results:**

- HTTP Status: `200 OK`
- Response contains weather data for Mountain View, CA
- Validation points:
  - `sys.country` equals "US"
  - `name` equals "Mountain View"
  - Weather data structure is complete

#### 2.3 Weather by City ID - Valid Request

**Priority**: Critical  
**Type**: Functional/Positive Testing

**Test Data**: City ID = "2172797" (Cairns, AU)

**Steps:**

1. Send GET request to `/data/2.5/weather`
2. Include valid API key in `appid` parameter
3. Set query parameter `id=2172797`

**Expected Results:**

- HTTP Status: `200 OK`
- Response contains weather data for Cairns, Australia
- Validation points:
  - `sys.country` equals "AU"
  - `name` equals "Cairns"
  - All weather data fields populated

### 3. Error Handling and Edge Cases

#### 3.1 Invalid City Name

**Priority**: High  
**Type**: Negative Testing

**Steps:**

1. Send request with non-existent city name
2. Set `q=NonExistentCity12345`
3. Include valid API key

**Expected Results:**

- HTTP Status: `404 Not Found`
- Error message indicating city not found

#### 3.2 Malformed ZIP Code

**Priority**: Medium  
**Type**: Negative Testing

**Steps:**

1. Send request with invalid ZIP format
2. Set `zip=invalid_zip`
3. Include valid API key

**Expected Results:**

- HTTP Status: `404 Not Found` or `400 Bad Request`
- Appropriate error message

#### 3.3 Invalid City ID

**Priority**: Medium  
**Type**: Negative Testing

**Steps:**

1. Send request with non-existent city ID
2. Set `id=999999999`
3. Include valid API key

**Expected Results:**

- HTTP Status: `404 Not Found`
- Error message for invalid city ID

### 4. Response Data Validation

#### 4.1 Complete Response Structure Validation

**Priority**: High  
**Type**: Data Integrity

**Steps:**

1. Make successful request for known city
2. Validate complete response structure

**Expected Response Fields:**

```json
{
  "coord": { "lon": number, "lat": number },
  "weather": [{ "id": number, "main": string, "description": string, "icon": string }],
  "base": string,
  "main": {
    "temp": number,
    "feels_like": number,
    "temp_min": number,
    "temp_max": number,
    "pressure": number,
    "humidity": number
  },
  "visibility": number,
  "wind": { "speed": number, "deg": number },
  "clouds": { "all": number },
  "dt": number,
  "sys": {
    "type": number,
    "id": number,
    "country": string,
    "sunrise": number,
    "sunset": number
  },
  "timezone": number,
  "id": number,
  "name": string,
  "cod": number
}
```

#### 4.2 Data Type Validation

**Priority**: Medium  
**Type**: Data Integrity

**Steps:**

1. Validate all numeric fields are numbers
2. Validate all string fields are strings
3. Validate timestamp fields are valid Unix timestamps

### 5. Performance and Reliability

#### 5.1 Response Time Validation

**Priority**: Medium  
**Type**: Performance

**Steps:**

1. Measure API response time for standard requests
2. Ensure responses are received within acceptable timeframe

**Expected Results:**

- Response time < 2000ms under normal conditions

#### 5.2 Concurrent Request Handling

**Priority**: Low  
**Type**: Load Testing

**Steps:**

1. Send multiple simultaneous requests
2. Validate all responses are correct

## Test Data Management

### Static Test Data

- **Kyiv, Ukraine**: Reliable city for testing European locations
- **Mountain View, US (94040)**: ZIP code testing for US locations
- **Cairns, Australia (ID: 2172797)**: City ID testing for Pacific region

### Dynamic Considerations

- Weather data changes frequently - focus on structure validation
- Some optional fields may not be present in all responses
- Timezone and coordinate data should remain consistent

## Regression Testing Strategy

### Smoke Tests (Run on every deployment)

- Authentication validation
- Basic weather retrieval by city name
- Response structure validation

### Full Regression (Weekly/Release)

- All test scenarios in this plan
- Extended error condition testing
- Performance validation

## Risk Assessment

### High Risk Areas

- API key security and validation
- Rate limiting behavior changes
- Response structure modifications

### Mitigation Strategies

- Regular API key rotation testing
- Monitoring for OpenWeather API changes
- Flexible assertion strategies for optional fields

## Maintenance Notes

### Regular Updates Required

- Monitor OpenWeather API documentation for changes
- Update test cities if they become unavailable
- Review rate limiting impacts on test execution
- Validate API key expiration handling

This comprehensive test plan ensures thorough validation of the OpenWeather Current Weather API functionality while maintaining robust error handling and data integrity checks.
