import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Configure Neon Local for development environment
// In development, we use the Neon Local proxy which requires HTTP-based communication
if (process.env.NODE_ENV === 'development') {
  const neonLocalHost = process.env.NEON_LOCAL_HOST || 'neon-local';
  const neonLocalPort = process.env.NEON_LOCAL_PORT || '5432';

  neonConfig.fetchEndpoint = `http://${neonLocalHost}:${neonLocalPort}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { db, sql };
