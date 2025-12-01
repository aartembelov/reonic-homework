// ...existing code...

# Reonic Invoice Service

This repository implements a minimal invoice management backend built with NestJS, Prisma and PostgreSQL. It accepts invoices in the provided JSON schema, persists them in Postgres via Prisma and exposes simple REST endpoints.

Key files:

- App entry: [src/main.ts](src/main.ts) ([`AppModule`](src/modules/app/app.module.ts))
- Database setup: [src/setup.ts](src/setup.ts)
- JSON schema: [schema/invoice.schema.json](schema/invoice.schema.json)
- Sample payloads: [sample-data](sample-data)
- Docker orchestration: [docker-compose.yml](docker-compose.yml)
- Docker image: [Dockerfile](Dockerfile)
- Build/runtime scripts: [package.json](package.json)

## API

Base URL: http://localhost:3000

Endpoints

- Create invoice

  - POST /invoices
  - Controller: [`InvoicesController`](src/modules/invoices/invoices.controller.ts)
  - Validation: [`JsonSchemaValidationPipe`](src/shared/pipes/json-schema-validation.pipe.ts) using [schema/invoice.schema.json](schema/invoice.schema.json)
  - Request example (JSON):
    ```json
    {
    	"invoiceId": "INV-A1B2C3D4-1234-5678-9ABC-DEF012345679",
    	"invoiceNumber": "2024-0001",
    	"customerName": "Solar Energy GmbH",
    	"customerEmail": "billing@solar-energy.de",
    	"customerAddress": {
    		"street": "Sonnenstraße 42",
    		"city": "München",
    		"postalCode": "80331",
    		"country": "Germany"
    	},
    	"invoiceDate": "2024-01-15",
    	"dueDate": "2024-02-14",
    	"items": [
    		{
    			"description": "Solar panel installation",
    			"quantity": 1,
    			"unitPrice": 8500,
    			"total": 8500
    		}
    	],
    	"subtotal": 8500,
    	"tax": 1615,
    	"total": 10115,
    	"currency": "EUR",
    	"status": "paid"
    }
    ```
  - Success response (201): See structure in [InvoiceResponse](http://_vscodecontentref_/0).
  - Flow:
    - Request validated by [JsonSchemaValidationPipe](http://_vscodecontentref_/1).
    - Mapping + domain validation by [InvoicesDomainService](http://_vscodecontentref_/2).
    - Persisted via [PostgresInvoicesStorageAdapter](http://_vscodecontentref_/3) using [PrismaService](http://_vscodecontentref_/4).

- Get invoice by public id

  - GET /invoices/:public_id
  - Controller: [InvoicesController](http://_vscodecontentref_/5)
  - Returns single invoice or 400 with `{ message: "Invoice not found by id" }`.

- Query invoices (customer / dates)
  - GET /invoices?customerName=<name>
  - GET /invoices?invoiceId=<referenceId>
  - GET /invoices?invoiceDate=<ISO date> OR invoiceDateFrom & invoiceDateTo
  - GET /invoices?dueDate=<ISO date> OR dueDateFrom & dueDateTo
  - Controller: [InvoicesController](http://_vscodecontentref_/6)
  - Pagination: not implemented (returns full result set).
  - Filtering implemented in [PostgresInvoicesStorageAdapter](http://_vscodecontentref_/7).

## How to run

- Local Docker (recommended)

  - Start DB: `docker compose up postgres -d`
  - Install deps: `npm ci`
  - Generate prisma client: `npm run prisma:generate`
  - Run setup: `npm run setup` (runs [setup.ts](http://_vscodecontentref_/8), which executes Prisma migrations)
  - Start server: `npm run start:dev` or via Docker: `docker compose up --build`

- Full docker: `docker compose up --build`
  - Container runs [npm run setup](http://_vscodecontentref_/9) (see Dockerfile) and then starts the app.

## Design decisions & trade-offs

- Normalized data model

  - Customers and addresses are separate entities (see prisma/schema.prisma): avoids duplication and supports multiple invoices per customer.
  - Trade-off: more joins / nested writes required.

- Prisma + Nested create

  - Persists invoice, customer, address and items in a single nested write for atomicity ([PostgresInvoicesStorageAdapter](http://_vscodecontentref_/10)).
  - Trade-off: nested writes require careful validation to avoid partial failures.

- Input validation

  - JSON Schema validation via [JsonSchemaValidationPipe](http://_vscodecontentref_/14) using [invoice.schema.json](http://_vscodecontentref_/15) ensures request shape before mapping to DTOs and domain objects.
  - Additional domain validation (totals, dates) implemented in [InvoicesDomainService](http://_vscodecontentref_/16).

- Error handling
  - CustomError ([custom-error.ts](http://_vscodecontentref_/17)) used for expected domain errors.
  - Global exception filter implemented in [ExceptionFilter](http://_vscodecontentref_/18) converts domain errors to HTTP 400 responses.

## Assumptions

- Incoming totals (item.total, subtotal, tax, total) are provided and must match domain validations. The service validates consistency (see [InvoicesDomainService](http://_vscodecontentref_/19)).
- Customer identity for lookups uses exact [customerName](http://_vscodecontentref_/20) equality.
- Date strings provided in requests are parseable by JS Date.
- Currency is an ISO 4217 code (default handled by domain if not provided).

## Known limitations & areas for improvement

- Customer matching is exact equality; should implement deduplication / lookup by email or case-insensitive matching.
- Search is basic (exact matches / range filters). Add full-text search, case-insensitive matching, partial matches and sorting.
- Totals are validated but currently accepted from client — calculation server-side would improve integrity and prevent tampering.
- Error responses are simple; add structured error codes and better logging.
- Consider rate limiting, input sanitization and security hardening for production readiness.

## Relevant code references

- Controllers: [InvoicesController](http://_vscodecontentref_/21)
- Services: [InvoicesService](http://_vscodecontentref_/22), [InvoicesDomainService](http://_vscodecontentref_/23), [CustomersDomainService](http://_vscodecontentref_/24)
- Storage: [PostgresInvoicesStorageAdapter](http://_vscodecontentref_/25)
- Prisma setup/service: [PrismaService](http://_vscodecontentref_/26), [schema.prisma](http://_vscodecontentref_/27)
- Transaction abstraction: [TransactionsService](http://_vscodecontentref_/28), [PostgresTransactionsAdapter](http://_vscodecontentref_/29)
- Validation pipe & schema: [JsonSchemaValidationPipe](http://_vscodecontentref_/30), [invoice.schema.json](http://_vscodecontentref_/31)
- Global filter: [ExceptionFilter](http://_vscodecontentref_/32)
- Database setup script: [setup.ts](http://_vscodecontentref_/33)
- Docker: [docker-compose.yml](http://_vscodecontentref_/34) and [Dockerfile](http://_vscodecontentref_/35)
- Examples: [sample-data](http://_vscodecontentref_/36)

## Notes

- The repository already contains example payloads in [sample-data](http://_vscodecontentref_/37) and the JSON schema at [invoice.schema.json](http://_vscodecontentref_/38).
- Migrations are present under [migrations](http://_vscodecontentref_/39). The setup script runs [npm run prisma:deploy](http://_vscodecontentref_/40) to apply migrations.

## Contact / next steps

- To extend this project: add more tests, improved searching, and server-side price computations.
- For questions about specific implementation points, inspect the linked files above, starting from [InvoicesController](http://_vscodecontentref_/41) and [PostgresInvoicesStorageAdapter](http://_vscodecontentref_/42).
