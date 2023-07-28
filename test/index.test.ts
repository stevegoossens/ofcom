// eslint-disable-next-line node/no-unpublished-import
import {afterEach, beforeEach, describe, expect, it} from '@jest/globals';
// eslint-disable-next-line node/no-unpublished-import
import nock from 'nock';

import Ofcom, {Configuration} from '../src';
import {ApiError} from '../src/errors';

describe('Ofcom', () => {
  const apiKey = process.env['API_KEY'] || 'API_SUBSCRIPTION_KEY';
  let basePath: string;
  let config: Configuration;
  let ofcom: Ofcom;

  beforeEach(() => {
    basePath = 'https://api-proxy.ofcom.org.uk';
    config = {
      apiKey,
    };
    ofcom = new Ofcom(config);
  });

  afterEach(() => {
    nock.abortPendingRequests();
    nock.cleanAll();
  });

  it('should instantiate', () => {
    // given

    // when

    // then
    expect(ofcom).toBeInstanceOf(Ofcom);
  });

  describe('broadbandCoverage', () => {
    it('should throw ApiError for missing apiKey', async () => {
      // given
      ofcom = new Ofcom();
      const postcode = 'W1A 1AA';
      const scope = nock(basePath)
        .get('/broadband/coverage/W1A1AA')
        .reply(401, {
          statusCode: 401,
          message:
            'Access denied due to missing subscription key. Make sure to include subscription key when making requests to an API.',
        });

      // when
      const provisions = ofcom.broadbandCoverage(postcode);

      // then
      await expect(provisions).rejects.toThrow(
        new ApiError('Exception thrown during API call')
      );
      expect(scope.isDone()).toBeTruthy();
    });

    it('should return coverage for valid postcode', async () => {
      // given
      const postcode = 'W1A 1AA';
      const scope = nock(basePath)
        .get('/broadband/coverage/W1A1AA')
        .query({
          'subscription-key': apiKey,
        })
        .reply(200, {
          PostCode: 'W1A1AA',
          Availability: [
            {
              AddressShortDescription:
                'RADIO ACCOUNTS DEPARTMENT BROADCASTING HOUSE, PORTLAND PLACE',
              MaxBbPredictedDown: 18,
              MaxBbPredictedUp: 1,
              MaxPredictedDown: 900,
              MaxPredictedUp: 900,
              MaxSfbbPredictedDown: -1,
              MaxSfbbPredictedUp: -1,
              MaxUfbbPredictedDown: 900,
              MaxUfbbPredictedUp: 900,
              PostCode: 'W1A1AA',
              UPRN: 10033541491,
            },
          ],
        });

      // when
      const provisions = ofcom.broadbandCoverage(postcode);

      // then
      await expect(provisions).resolves.toEqual([
        {
          AddressShortDescription:
            'RADIO ACCOUNTS DEPARTMENT BROADCASTING HOUSE, PORTLAND PLACE',
          MaxBbPredictedDown: 18,
          MaxBbPredictedUp: 1,
          MaxPredictedDown: 900,
          MaxPredictedUp: 900,
          MaxSfbbPredictedDown: -1,
          MaxSfbbPredictedUp: -1,
          MaxUfbbPredictedDown: 900,
          MaxUfbbPredictedUp: 900,
          PostCode: 'W1A1AA',
          UPRN: 10033541491,
        },
      ]);
      expect(scope.isDone()).toBeTruthy();
    });

    it('should throw ApiError for invalid postcode', async () => {
      // given
      const postcode = 'plop';
      const scope = nock(basePath)
        .get(`/broadband/coverage/${postcode}`)
        .query({
          'subscription-key': apiKey,
        })
        .reply(404, {
          PostCode: 'PLOP',
          Error: 'Post code not found',
        });

      // when
      const provisions = ofcom.broadbandCoverage(postcode);

      // then
      await expect(provisions).rejects.toThrow(
        new ApiError(
          'Bad response from API: status=404, body={"PostCode":"PLOP","Error":"Post code not found"}'
        )
      );
      expect(scope.isDone()).toBeTruthy();
    });
  });
});
