import {
  Api as BroadbandApi,
  Configuration as BroadbandConfiguration,
  CoverageApi as BroadbandCoverageApi,
  CoverageApiFactory as BroadbandCoverageApiFactory,
} from './openapi/broadband';
import {ApiError} from './errors';

export type Configuration = BroadbandConfiguration;

class Ofcom {
  private _broadbandCoverageApi: BroadbandCoverageApi;

  constructor(configuration?: Configuration) {
    this._broadbandCoverageApi = BroadbandCoverageApiFactory(configuration);
  }

  async broadbandCoverage(
    postcode: string
  ): Promise<BroadbandApi.BroadbandProvision[]> {
    try {
      const response = await this._broadbandCoverageApi.coverageByPostCodeGet(
        postcode.replaceAll(' ', '')
      );
      if (
        response.status === 200 &&
        response.body.PostCode &&
        response.body.Availability
      ) {
        return response.body.Availability;
      } else {
        throw new ApiError(
          `Bad response from API: status=${
            response.status
          }, body=${JSON.stringify(response.body)}`
        );
      }
    } catch (error) {
      throw this.getApiError(error);
    }
  }

  /**
   * Get ApiError or wrap a different thrown type with ApiError
   *
   * @param {unknown} error ApiError or unknown
   * @returns {ApiError} ApiError or ApiError with cause (i.e. wrapped)
   */
  private getApiError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    } else {
      return new ApiError('Exception thrown during API call', {cause: error});
    }
  }
}

module.exports = Ofcom;
export default Ofcom;
