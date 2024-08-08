import { afterEach, afterAll, beforeAll, describe, expect, test } from "bun:test";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { BroadbandApi, MobileApi } from "../src";

// API mocks
const responseBodyBroadband200 = {
  "PostCode": "BR12WJ",
  "Availability": [
      {
          "UPRN": 100020416747,
          "AddressShortDescription": "2, TANGLEBERRY CLOSE",
          "PostCode": "BR12WJ",
          "MaxBbPredictedDown": 15.0,
          "MaxBbPredictedUp": 1.0,
          "MaxSfbbPredictedDown": 64.0,
          "MaxSfbbPredictedUp": 14.0,
          "MaxUfbbPredictedDown": -1.0,
          "MaxUfbbPredictedUp": -1.0,
          "MaxPredictedDown": 64.0,
          "MaxPredictedUp": 14.0
      },
      {
          "UPRN": 100020416748,
          "AddressShortDescription": "3, TANGLEBERRY CLOSE",
          "PostCode": "BR12WJ",
          "MaxBbPredictedDown": 15.0,
          "MaxBbPredictedUp": 1.0,
          "MaxSfbbPredictedDown": 64.0,
          "MaxSfbbPredictedUp": 14.0,
          "MaxUfbbPredictedDown": -1.0,
          "MaxUfbbPredictedUp": -1.0,
          "MaxPredictedDown": 64.0,
          "MaxPredictedUp": 14.0
      },
      {
          "UPRN": 100020416746,
          "AddressShortDescription": "1, TANGLEBERRY CLOSE",
          "PostCode": "BR12WJ",
          "MaxBbPredictedDown": 15.0,
          "MaxBbPredictedUp": 1.0,
          "MaxSfbbPredictedDown": 59.0,
          "MaxSfbbPredictedUp": 12.0,
          "MaxUfbbPredictedDown": -1.0,
          "MaxUfbbPredictedUp": -1.0,
          "MaxPredictedDown": 59.0,
          "MaxPredictedUp": 12.0
      }
  ],
  "Count": 3
};
const responseBodyMobile200 = {
  "PostCode": "BR12WJ",
  "DBName": "MobileAvailability-202406041254",
  "Availability": [
      {
          "UPRN": 100020416748,
          "AddressShortDescription": "3, TANGLEBERRY CLOSE",
          "PostCode": "BR12WJ",
          "EEVoiceOutdoor": 4,
          "EEVoiceOutdoorNo4g": 4,
          "EEVoiceIndoor": 3,
          "EEVoiceIndoorNo4g": 3,
          "EEDataOutdoor": 4,
          "EEDataOutdoorNo4g": 3,
          "EEDataIndoor": 3,
          "EEDataIndoorNo4g": 0,
          "H3VoiceOutdoor": 4,
          "H3VoiceOutdoorNo4g": 4,
          "H3VoiceIndoor": 3,
          "H3VoiceIndoorNo4g": 0,
          "H3DataOutdoor": 4,
          "H3DataOutdoorNo4g": 3,
          "H3DataIndoor": 3,
          "H3DataIndoorNo4g": 0,
          "TFVoiceOutdoor": 4,
          "TFVoiceOutdoorNo4g": 4,
          "TFVoiceIndoor": 3,
          "TFVoiceIndoorNo4g": 3,
          "TFDataOutdoor": 4,
          "TFDataOutdoorNo4g": 3,
          "TFDataIndoor": 3,
          "TFDataIndoorNo4g": 3,
          "VOVoiceOutdoor": 4,
          "VOVoiceOutdoorNo4g": 4,
          "VOVoiceIndoor": 3,
          "VOVoiceIndoorNo4g": 3,
          "VODataOutdoor": 4,
          "VODataOutdoorNo4g": 0,
          "VODataIndoor": 3,
          "VODataIndoorNo4g": 0
      },
      {
          "UPRN": 100020416747,
          "AddressShortDescription": "2, TANGLEBERRY CLOSE",
          "PostCode": "BR12WJ",
          "EEVoiceOutdoor": 4,
          "EEVoiceOutdoorNo4g": 4,
          "EEVoiceIndoor": 3,
          "EEVoiceIndoorNo4g": 3,
          "EEDataOutdoor": 4,
          "EEDataOutdoorNo4g": 3,
          "EEDataIndoor": 3,
          "EEDataIndoorNo4g": 0,
          "H3VoiceOutdoor": 4,
          "H3VoiceOutdoorNo4g": 4,
          "H3VoiceIndoor": 3,
          "H3VoiceIndoorNo4g": 0,
          "H3DataOutdoor": 4,
          "H3DataOutdoorNo4g": 3,
          "H3DataIndoor": 3,
          "H3DataIndoorNo4g": 0,
          "TFVoiceOutdoor": 4,
          "TFVoiceOutdoorNo4g": 4,
          "TFVoiceIndoor": 3,
          "TFVoiceIndoorNo4g": 3,
          "TFDataOutdoor": 4,
          "TFDataOutdoorNo4g": 3,
          "TFDataIndoor": 3,
          "TFDataIndoorNo4g": 3,
          "VOVoiceOutdoor": 4,
          "VOVoiceOutdoorNo4g": 4,
          "VOVoiceIndoor": 3,
          "VOVoiceIndoorNo4g": 3,
          "VODataOutdoor": 4,
          "VODataOutdoorNo4g": 0,
          "VODataIndoor": 3,
          "VODataIndoorNo4g": 0
      },
      {
          "UPRN": 100020416746,
          "AddressShortDescription": "1, TANGLEBERRY CLOSE",
          "PostCode": "BR12WJ",
          "EEVoiceOutdoor": 4,
          "EEVoiceOutdoorNo4g": 4,
          "EEVoiceIndoor": 3,
          "EEVoiceIndoorNo4g": 3,
          "EEDataOutdoor": 4,
          "EEDataOutdoorNo4g": 3,
          "EEDataIndoor": 3,
          "EEDataIndoorNo4g": 0,
          "H3VoiceOutdoor": 4,
          "H3VoiceOutdoorNo4g": 4,
          "H3VoiceIndoor": 3,
          "H3VoiceIndoorNo4g": 0,
          "H3DataOutdoor": 4,
          "H3DataOutdoorNo4g": 3,
          "H3DataIndoor": 3,
          "H3DataIndoorNo4g": 0,
          "TFVoiceOutdoor": 4,
          "TFVoiceOutdoorNo4g": 4,
          "TFVoiceIndoor": 3,
          "TFVoiceIndoorNo4g": 3,
          "TFDataOutdoor": 4,
          "TFDataOutdoorNo4g": 3,
          "TFDataIndoor": 3,
          "TFDataIndoorNo4g": 3,
          "VOVoiceOutdoor": 4,
          "VOVoiceOutdoorNo4g": 4,
          "VOVoiceIndoor": 3,
          "VOVoiceIndoorNo4g": 3,
          "VODataOutdoor": 4,
          "VODataOutdoorNo4g": 0,
          "VODataIndoor": 3,
          "VODataIndoorNo4g": 0
      }
  ]
};
const handlers = [
  http.get('https://api-proxy.ofcom.org.uk/broadband/coverage/BR12WJ', () => {
    return HttpResponse.json(responseBodyBroadband200);
  }),
  http.get('https://api-proxy.ofcom.org.uk/broadband/coverage/BR1%202WJ', () => {
    return HttpResponse.json({
      PostCode: "BR1 2WJ",
      Error: "Post code not found"
    }, { status: 404 });
  }),
  http.get('https://api-proxy.ofcom.org.uk/broadband/coverage/NotPostcode', () => {
    return HttpResponse.json({
      PostCode: "NotPostcode",
      Error: "Post code not found"
    }, { status: 404 });
  }),
  http.get('https://api-proxy.ofcom.org.uk/broadband/coverage/CV339SZ', () => {
    return HttpResponse.json({
      statusCode: 401,
      message: "Access denied due to missing subscription key. Make sure to include subscription key when making requests to an API."
    }, { status: 401 });
  }),
  http.get('https://api-proxy.ofcom.org.uk/broadband/coverage/1', () => {
    return HttpResponse.json({
      Error: "There was a problem servicing your request"
    }, { status: 500 });
  }),
  http.get('https://api-proxy.ofcom.org.uk/mobile/coverage/BR12WJ', () => {
    return HttpResponse.json(responseBodyMobile200);
  }),
  http.get('https://api-proxy.ofcom.org.uk/mobile/coverage/BR1%202WJ', () => {
    return HttpResponse.json({
      PostCode: "BR1 2WJ",
      Error: "Post code not found"
    }, { status: 404 });
  }),
  http.get('https://api-proxy.ofcom.org.uk/mobile/coverage/NotPostcode', () => {
    return HttpResponse.json({
      PostCode: "NotPostcode",
      Error: "Post code not found"
    }, { status: 404 });
  }),
  http.get('https://api-proxy.ofcom.org.uk/mobile/coverage/CV339SZ', () => {
    return HttpResponse.json({
      statusCode: 401,
      message: "Access denied due to missing subscription key. Make sure to include subscription key when making requests to an API."
    }, { status: 401 });
  }),
  http.get('https://api-proxy.ofcom.org.uk/mobile/coverage/1', () => {
    return HttpResponse.json({
      Error: "There was a problem servicing your request"
    }, { status: 500 });
  }),
];
const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({
    onUnhandledRequest: (request) => {
      throw new Error(
        `No request handler found for ${request.method} ${request.url}`
      );
    },
  });
})

afterEach(() => {
  server.restoreHandlers();
});

afterAll(() => {
  server.close();
})

describe('Broadband API', () => {
  test('gets broadband provision for valid postcode', async () => {
    // given
    const broadbandApi = new BroadbandApi();
    const postCode = 'BR1 2WJ';

    // when
    const { data, error, response } = await broadbandApi.coverageByPostCode(postCode);

    // then
    expect(response.status).toEqual(200);
    expect(data).toEqual(responseBodyBroadband200);
    expect(error).toBeUndefined();
  });

  test('gets broadband provision for valid postcode without space', async () => {
    // given
    const broadbandApi = new BroadbandApi();
    const postCode = 'BR12WJ';
    
    // when
    const { data, error, response } = await broadbandApi.coverageByPostCode(postCode);

    // then
    expect(response.status).toEqual(200);
    expect(data).toEqual(responseBodyBroadband200);
    expect(error).toBeUndefined();
  });

  test('gets error for invalid postcode', async () => {
    // given
    const broadbandApi = new BroadbandApi();
    const postCode = 'NotPostcode';
    
    // when
    const { data, error, response } = await broadbandApi.coverageByPostCode(postCode);

    // then
    expect(response.status).toEqual(404);
    expect(data).toBeUndefined();
    expect(error).toEqual({
      // @ts-ignore: bug, error type is the schema of the first 5xx or 4xx (in that order)
      PostCode: postCode,
      Error: 'Post code not found',
    });
  });

  test('gets error for null postcode', async () => {
    // given
    const broadbandApi = new BroadbandApi();
    const postCode = null;
    
    // when
    const { data, error, response } = await broadbandApi.coverageByPostCode(postCode as unknown as string);

    // then
    expect(response.status).toEqual(500);
    expect(data).toBeUndefined();
    expect(error).toEqual(expect.objectContaining({
      name: 'Error',
      message: 'No request handler found for GET https://api-proxy.ofcom.org.uk/broadband/coverage/%7BPostCode%7D',
    }));
  });

  test('gets error for postcode "1"', async () => {
    // given
    const broadbandApi = new BroadbandApi();
    const postCode = '1';
    
    // when
    const { data, error, response } = await broadbandApi.coverageByPostCode(postCode);

    // then
    expect(response.status).toEqual(500);
    expect(data).toBeUndefined();
    expect(error).toEqual({
      Error: 'There was a problem servicing your request',
    });
  });

  test('gets error for missing/wrong API key', async () => {
    // given
    const broadbandApi = new BroadbandApi();
    const postCode = 'CV339SZ'; // this postcode matches a mocked 401
    
    // when
    const { data, error, response } = await broadbandApi.coverageByPostCode(postCode);

    // then
    expect(response.status).toEqual(401);
    expect(data).toBeUndefined();
    // TODO: add 401 response to OpenAPI
    expect(error).toEqual({
      // @ts-ignore: bug, error type is the schema of the first 5xx or 4xx (in that order)
      statusCode: 401,
      message: 'Access denied due to missing subscription key. Make sure to include subscription key when making requests to an API.',
    });
  });
});

describe('Mobile API', () => {
  test('gets mobile provision for valid postcode', async () => {
    // given
    const mobileApi = new MobileApi();
    const postCode = 'BR1 2WJ';

    // when
    const { data, error, response } = await mobileApi.coverageByPostCode(postCode);

    // then
    expect(response.status).toEqual(200);
    expect(data).toEqual(responseBodyMobile200);
    expect(error).toBeUndefined();
  });

  test('gets mobile provision for valid postcode without space', async () => {
    // given
    const mobileApi = new MobileApi();
    const postCode = 'BR12WJ';
    
    // when
    const { data, error, response } = await mobileApi.coverageByPostCode(postCode);

    // then
    expect(response.status).toEqual(200);
    expect(data).toEqual(responseBodyMobile200);
    expect(error).toBeUndefined();
  });

  test('gets error for invalid postcode', async () => {
    // given
    const mobileApi = new MobileApi();
    const postCode = 'NotPostcode';
    
    // when
    const { data, error, response } = await mobileApi.coverageByPostCode(postCode);

    // then
    expect(response.status).toEqual(404);
    expect(data).toBeUndefined();
    expect(error).toEqual({
      // @ts-ignore: bug, error type is the schema of the first 5xx or 4xx (in that order)
      PostCode: postCode,
      Error: 'Post code not found',
    });
  });

  test('gets error for null postcode', async () => {
    // given
    const mobileApi = new MobileApi();
    const postCode = null;
    
    // when
    const { data, error, response } = await mobileApi.coverageByPostCode(postCode as unknown as string);

    // then
    expect(response.status).toEqual(500);
    expect(data).toBeUndefined();
    expect(error).toEqual(expect.objectContaining({
      name: 'Error',
      message: 'No request handler found for GET https://api-proxy.ofcom.org.uk/mobile/coverage/%7BPostCode%7D',
    }));
  });

  test('gets error for postcode "1"', async () => {
    // given
    const mobileApi = new MobileApi();
    const postCode = '1';
    
    // when
    const { data, error, response } = await mobileApi.coverageByPostCode(postCode);

    // then
    expect(response.status).toEqual(500);
    expect(data).toBeUndefined();
    expect(error).toEqual({
      Error: 'There was a problem servicing your request',
    });
  });

  test('gets error for missing/wrong API key', async () => {
    // given
    const mobileApi = new MobileApi();
    const postCode = 'CV339SZ'; // this postcode matches a mocked 401
    
    // when
    const { data, error, response } = await mobileApi.coverageByPostCode(postCode);

    // then
    expect(response.status).toEqual(401);
    expect(data).toBeUndefined();
    // TODO: add 401 response to OpenAPI
    expect(error).toEqual({
      // @ts-ignore: bug, error type is the schema of the first 5xx or 4xx (in that order)
      statusCode: 401,
      message: 'Access denied due to missing subscription key. Make sure to include subscription key when making requests to an API.',
    });
  });
});
