import { MessageKeys, MESSAGES } from '../constants/messages';
import { CustomApiResponse } from '../interfaces/api-response.interface';

export function createCustomApiResponse<T>(
  messageKey: MessageKeys,
  data: T,
  success: boolean = true, // Default true
  metadata?: Record<string, any>,
): CustomApiResponse<T> {
  const message = MESSAGES[messageKey];

  return {
    success,
    message,
    data,
    metadata,
  };
}
