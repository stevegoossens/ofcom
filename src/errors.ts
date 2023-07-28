/**
 * A consistent error with optional cause
 *
 * @export
 * @class ApiError
 * @extends {Error}
 */
export class ApiError extends Error {
  /**
   * @constructor
   * @param {string} message Error message (default = "API Error")
   * @param {ErrorOptions} [options] Optional options
   * @param {unknown} [options.cause] Error cause (e.g. another Error)
   */
  constructor(message = 'API Error', options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = 'ApiError';
  }
}
