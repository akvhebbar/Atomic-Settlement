import { z } from 'zod';
import { simulationStatusSchema, verifyRequestSchema } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  simulation: {
    setStatus: {
      method: 'POST' as const,
      path: '/api/simulation/status' as const,
      input: z.object({ status: simulationStatusSchema }),
      responses: {
        200: z.object({ success: z.boolean(), status: simulationStatusSchema }),
        400: errorSchemas.validation,
      },
    },
    verify: {
      method: 'POST' as const,
      path: '/api/verify' as const,
      input: verifyRequestSchema,
      responses: {
        200: z.object({ status: z.string(), message: z.string() }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
