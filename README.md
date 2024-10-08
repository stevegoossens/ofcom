# @stevegoossens/ofcom

![CI test](https://github.com/stevegoossens/ofcom/actions/workflows/bun_ci.yml/badge.svg)

Client for api.ofcom.org.uk which provides Broadband speeds and Mobile coverage for each address of a specified postcode.

<!-- toc -->

- [Ofcom API account](#ofcom-api-account)
- [Usage](#usage)
  * [Install](#install)
  * [Credentials](#credentials)
  * [Example code](#example-code)
- [Development](#development)
  * [OpenAPI](#openapi)
    + [OpenAPI errata](#openapi-errata)
      - [Broadband errata](#broadband-errata)
      - [Mobile errata](#mobile-errata)
  * [Install](#install-1)
    + [Generate code from OpenAPI](#generate-code-from-openapi)
  * [Format](#format)
  * [Lint](#lint)
  * [Check](#check)
  * [Test](#test)
  * [Build](#build)
  * [NPM](#npm)
    + [Login to NPM repository](#login-to-npm-repository)
    + [Publish to NPM repository](#publish-to-npm-repository)
  * [Update Table of Contents](#update-table-of-contents)

<!-- tocstop -->

## Ofcom API account

Create an Ofcom API account at the [sign up](https://api.ofcom.org.uk/signup/) page, and then request access to the [products](https://api.ofcom.org.uk/products) you wish to use:

| Name | Description |
|------|-------------|
| [Broadband Coverage (Basic)](https://api.ofcom.org.uk/product#product=broadband) | Subscribers can retrieve broadband coverage data against postcodes up to run 100 calls/minute for 50,000 requests per month. |
| [Broadband Coverage (Premium)](https://api.ofcom.org.uk/product#product=broadband-premium) | Subscribers can retrieve broadband coverage data against postcodes up to run 500 calls/minute for 150,000 requests per month. |
| [Mobile Coverage (Basic)](https://api.ofcom.org.uk/product#product=mobile) | Subscribers can retrieve mobile coverage data against postcodes up to run 100 calls/minute for 50,000 requests per month. |
| [Mobile Coverage (Premium)](https://api.ofcom.org.uk/product#product=mobile-premium) | Subscribers can retrieve broadband coverage data against postcodes up to run 500 calls/minute for 150,000 requests per month. |

## Usage

Add this as a dependency for your TypeScript/JavaScript project, create a `.env` file with Ofcom API credentials, and then add client code to your project.

### Install

Use your chosen package manager to install this dependency:

```
npm install --save @stevegoossens/ofcom
```
```
yarn add @stevegoossens/ofcom
```
```
bun add @stevegoossens/ofcom
```

### Credentials

The API keys are listed on your [profile page](https://api.ofcom.org.uk/profile) as "Primary key" and "Secondary key" for each of the Ofcom API products that you have been granted access.

Create a `.env` file containing the credentials, e.g.

```
BROADBAND_API_KEY=abcdef1234567890
MOBILE_API_KEY=01543987abcdef
```

### Example code

```typescript
import { BroadbandApi } from "@stevegoossens/ofcom";

const broadbandApi = new BroadbandApi();

const postCode = 'BR1 2WJ';

const { data, error, response } = await broadbandApi.coverageByPostCode(postCode);
```
```typescript
import { MobileApi } from "@stevegoossens/ofcom";

const mobileApi = new MobileApi();

const postCode = 'BR1 2WJ';

const { data, error, response } = await mobileApi.coverageByPostCode(postCode);
```

- `data`: successful response body
- `error`: error response body
- `response`: the `fetch` `Response`

## Development

### OpenAPI

The Ofcom APIs for Broadband and Mobile are available at:

- https://api.ofcom.org.uk/api-details#api=ofcom-connected-nations-broadband-api
- https://api.ofcom.org.uk/api-details#api=ofcom-connected-nations-api

These can be downloaded (by clicking the "API definition" dropdown, then clicking "Open API 3 (YAML)") and copied to `./data`

#### OpenAPI errata

There are some inaccuracies in the OpenAPI spec files for each API. These need to be corrected in the YAML before generating code from them.

##### Broadband errata

The OpenAPI document for Broadband API has the following errata:

- `GET /coverage/{PostCode}`
  - 200 response body schema
    - is missing the `Count` property (type: integer)
    - `UPRN` property in `BroadbandProvision` has format `int32`, but this is too small and should be `int64`
  - 401 response is missing
    - body schema has:
      - `statusCode` (type: integer)
      - `message` (type: string)
    - headers:
      - `WWW-Authenticate`: `AzureApiManagementKey realm="https://api-proxy.ofcom.org.uk/broadband",name="Ocp-Apim-Subscription-Key",type="header"`
  - 404 response body schema
    - `ErrorMessage` property is actually named `Error`
  - 500 response body schema
    - `ErrorMessage` property is actually named `Error`

##### Mobile errata

The OpenAPI document for Mobile API has the following errata:

- `GET /coverage/{PostCode}`
  - 200 response body schema
    - is specified as `MobileAvailabilityArray` when it is actually `MobileAvailability`
    - is missing the `DBName` property (type: string)
    - `UPRN` property in `MobileProvision` has format `int32`, but this is too small and should be `int64`
  - 401 response is missing
    - body schema has:
      - `statusCode` (type: integer)
      - `message` (type: string)
    - headers:
      - `WWW-Authenticate`: `AzureApiManagementKey realm="https://api-proxy.ofcom.org.uk/broadband",name="Ocp-Apim-Subscription-Key",type="header"`
  - 404 response body schema
    - `ErrorMessage` property is actually named `Error`
  - 500 response body schema
    - `ErrorMessage` property is actually named `Error`

### Install

```
bun install
```

#### Generate code from OpenAPI

Clean out the previously generated code at `./src/openapi-fetch`:

```
bun clean
```

Generate the API code:

```
bun generate:broadband
bun generate:mobile
```

### Format

Apply code style

```
bun run format
```

### Lint

Fix linting errors

```
bun run lint
```

### Check

Fix linting errors and apply code style

```
bun run check
```

### Test

Run unit tests

```
bun test
```

Tests with coverage

```
bun test --coverage
```

### Build

```
bun run build
```

### NPM

Publish package to NPM

#### Login to NPM repository

```
npm login
```

Open the generated URL in a browser, login, supply the MFA/2FA code.

#### Publish to NPM repository

First time, if the package does not exist:

```
npm publish --access=public
```

### Update Table of Contents

The table of contents in this readme was generated by [markdown-toc](https://github.com/jonschlinkert/markdown-toc). If you add/remove headings or change the order of them, regenerate the table of contents:

```
bun toc
```
