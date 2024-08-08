import 'dotenv/config';

import createClient, { Client } from 'openapi-fetch';

import type { paths as pathsBroadband } from './openapi-fetch/broadband';
import type { paths as pathsMobile } from './openapi-fetch/mobile';

export class BroadbandApi {
  private client: Client<pathsBroadband>;

  constructor() {
    this.client = createClient<pathsBroadband>({
      baseUrl: 'https://api-proxy.ofcom.org.uk/broadband',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.BROADBAND_API_KEY,
      },
    });
  }
  async coverageByPostCode(postCode: string) {
    return this.client.GET('/coverage/{PostCode}', {
      params: {
        path: { PostCode: postCode }
      }
    });
  }
}

export class MobileApi {
  private client: Client<pathsMobile>;

  constructor() {
    this.client = createClient<pathsMobile>({
      baseUrl: 'https://api-proxy.ofcom.org.uk/mobile',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.MOBILE_API_KEY,
      },
    });
  }
  async coverageByPostCode(postCode: string) {
    return this.client.GET('/coverage/{PostCode}', {
      params: {
        path: { PostCode: postCode }
      }
    });
  }
}
