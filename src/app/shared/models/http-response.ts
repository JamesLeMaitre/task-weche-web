/**
 * Represents an HTTP response.
 *
 * @template T - The type of the data in the response.
 */
export class HttpResponse<T> {
  /**
   * The status code of the response.
   */
  status!: number;

  /**
   * The message associated with the response.
   */
  message!: string;

  /**
   * The data in the response.
   */
  data!: T;
}
