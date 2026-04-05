// infra/http/setup.ts

import { registerRequestMiddleware, registerResponseMiddleware } from './http-client';
import { authMiddleware } from './middlewares/auth.middleware';
import { loggerMiddleware, responseLoggerMiddleware } from './middlewares/logger.middleware';

registerRequestMiddleware(authMiddleware);
registerRequestMiddleware(loggerMiddleware);

registerResponseMiddleware(responseLoggerMiddleware); 