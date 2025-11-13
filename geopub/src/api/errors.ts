import type { Context } from "hono";

/**
 * Details about an error which occurred during an API endpoint.
 **/
export type APIError = {
  /**
   * Technical message describing what went wrong.
   **/
  detail: string;

  /**
   * Dot path of what part of the body this error is for. Empty if for entire request generally.
   **/
  target: string[];
};

/**
 * Send APIError as response.
 **/
export function sendAPIError(c: Context, code: number, err: APIError) {
  return c.json(err, code);
}
