# Reonic Backend Take-Home Exercise

## Overview

Welcome to the Reonic Backend take-home exercise! In this task, you'll
build a simple invoice storage and retrieval service using TypeScript,
Node.js, and PostgreSQL.

We use this exercise to evaluate your technical skills and to see how
you approach problems.  Our evaluation of your submission determines
whether we continue the hiring process with you or whether we stop.
For that reason, it is important to us that you enjoy the process
itself for the challenge and maybe also for trying out something new
in your implementation.  Remember that you will not be compensated for
the time you spend on this exercise, so make sure that you find some
enjoyment in the work itself.

We do not provide you with a fixed time limit that you spend on
working on the exercise, but please submit your solution by the date
you have been given as the deadline.  You can certainly ask for an
extension, as personal matters can always interfere.

We use LLM based coding assistants in our work and we don't expect you
to work without.  In this exercise, however, we're interested in
seeing your own coding skills.  We have limited time to review your
code, so don't submit large amounts of code that you've not written
yourself.

## Context

At Reonic, we work extensively with structured data from various
sources. This exercise simulates a common pattern in our backend
systems: receiving data in a standardized format, persisting it
reliably, and providing flexible APIs for retrieval and search.

## Tech Stack Requirements

### Required
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Runtime:** Node.js

### Optional (we use these at Reonic, but feel free to use alternatives or use no libraries)
- **ORM:** Prisma
- **API:** Apollo GraphQL

You are free to choose:
- HTTP server framework (Express, Fastify, Koa, etc.)
- REST or GraphQL API style
- Any additional libraries you find helpful

## Task Description

Build a service that can:

1. **Accept and store invoices** in the provided JSON format
2. **Retrieve invoices** by:
   - Invoice ID
   - Customer name
   - Date (or date range)
3. **Provide a search interface** that allows flexible querying across invoice fields

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Node.js 20+ installed (for local development)

### Setup

We have provided a `docker-compose.yml` that contains the database
server and a skeleton application container that is to contain your
application code.

#### Option 1: Development

1. Start only the PostgreSQL database:
   ```bash
   docker compose up postgres -d
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Implement your database setup in `src/setup.ts`

4. Run the setup script:
   ```bash
   npm run build && npm run setup
   ```

5. Start the application:
   ```bash
   npm run dev
   ```

#### Option 2: Full Docker Environment (Test your final submission)

Start everything with Docker:
```bash
docker compose up --build
```

This will:
- Start PostgreSQL
- Build your application
- Run your database setup script (`src/setup.ts`)
- Start your application server

### Application startup

Your application should:
1. Automatically set up the database schema (via `src/setup.ts`)
2. Start and be ready to accept requests
3. Be accessible at `http://localhost:3000`

### Database Connection

The PostgreSQL database is configured with the following credentials
(see `docker-compose.yml`):

**For local development (connecting from your host machine):**
- Connection string: `postgresql://reonic:reonic_dev@localhost:54320/invoices`

**For Docker (connecting from the app container):**
- Connection string: `postgresql://reonic:reonic_dev@postgres:5432/invoices`

The `DATABASE_URL` environment variable is automatically set correctly
in both environments.

## Invoice Format

Invoices follow the JSON schema defined in
`schema/invoice.schema.json`. Sample invoices are provided in the
`sample-data/` directory.

## What We're Looking For

### Must Have
1. **Docker-ready solution**: Your application must start successfully
with `docker compose up --build`

2. **Database setup script** (`src/setup.ts`):
   - Creates all necessary tables/schema
   - Should be idempotent (safe to run multiple times)
   - Runs automatically when the Docker container starts

3. **Working API endpoints** for:
   - Creating/storing an invoice
   - Retrieving an invoice by ID
   - Retrieving invoices by customer name
   - Retrieving invoices by date or date range
   - Searching across invoices

4. **Data validation**: Ensure incoming data matches the schema

5. **Database schema**: A well-designed schema for storing invoices

6. **Type safety**: Proper TypeScript types throughout

7. **Basic error handling**: Handle common error cases gracefully

8. **README/Documentation**:
   - API documentation (endpoints, request/response formats, example requests)
   - Your design decisions and trade-offs
   - Any assumptions you made
   - Any known limitations or areas for improvement

### Nice to Have
- Tests for core functionality
- Structured database migrations (instead of a simple setup script)
- Pagination for list/search endpoints
- Advanced search features (partial matching, multiple filters, sorting, etc.)
- Input sanitization and security considerations
- Structured logging
- API request validation middleware
- Health check endpoint

### Not Required
- Authentication/authorization
- Frontend or API client
- Deployment configuration
- Comprehensive test coverage (focus on key functionality if time permits)

## Evaluation Criteria

We'll be looking at:

1. **Code quality**: Is the code clean, readable, and well-organized?
2. **TypeScript usage**: Are types used effectively?
3. **API design**: Are the endpoints logical and easy to use?
4. **Database design**: Is the schema appropriate for the use case?
5. **Error handling**: Are errors handled appropriately?
6. **Documentation**: Can we understand and run your code?
7. **Pragmatism**: Did you make reasonable trade-offs given the time constraint?

## Submission

Please provide your source code (including all files needed to run via
Docker) in a GitHub repository or a single ZIP file.

**Before submitting, please test that your solution works by:**
1. Stopping all containers: `docker compose down -v`
2. Starting fresh: `docker compose up --build`
3. Testing your API endpoints

## Questions?

If you have any questions or need clarification on requirements,
please don't hesitate to reach out. We prefer that you ask rather than
make incorrect assumptions.

## Time Management

If you're running short on time:
- Focus on core functionality first (store and retrieve)
- A simple but working solution is better than an incomplete complex one
- Document what you would do with more time
- Don't worry about edge cases or production-readiness
- Consider our time, too.  We certainly love a good and polished
  submission, but our the time we can spend on reviewing each of them
  is limited.

Good luck, and we look forward to reviewing your solution!
