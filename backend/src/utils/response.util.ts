import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errorDataOrString?: string | Record<string, any>,
  errors?: Record<string, string>
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error: typeof errorDataOrString === 'string' ? errorDataOrString : message,
    errors,
    data: typeof errorDataOrString === 'object' ? errorDataOrString : undefined,
  };
  return res.status(statusCode).json(response);
};
