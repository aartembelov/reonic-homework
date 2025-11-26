/**
 * Reonic Invoice Service
 *
 * This is a minimal scaffolding to get you started. Feel free to:
 * - Add any HTTP framework you prefer (Express, Fastify, Koa, etc.)
 * - Use any ORM or query builder (Prisma, Drizzle, Kysely, etc.)
 * - Restructure files and folders as you see fit
 * - Add any additional libraries you need
 */

// Database connection string
// You can use this with pg, Prisma, or any other PostgreSQL client
export const DATABASE_URL = process.env.DATABASE_URL ||
  'postgresql://reonic:reonic_dev@localhost:54320/invoices';

const main = async () => {
  console.log('Invoice Service Starting...');
  console.log('Database URL:', DATABASE_URL);

  // TODO: Initialize your server here
  // Examples:
  // - Set up Express/Fastify/etc.
  // - Initialize database connection
  // - Define routes/endpoints
  // - Start listening on a port

  console.log('Ready to implement your solution!');
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
