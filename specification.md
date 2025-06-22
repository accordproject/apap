# Accord Project Agreement Protocol Specification — 1.0.0

This document describes the 1.0.x version of the language server protocol. An implementation for node of the 1.0.x version of the protocol can be found here (TBD).

Note: edits to this specification can be made via a pull request against [this markdown document](specification.md).

## Open API

The protocol is defined via an [Open API document](./openapi.json), which specified the required API methods as well as their expected request and response data formats.

The Open API documentation has been generated in both [markdown format](./index.md), and as a [static HTML site](./_site/index.html) viewable by cloning this repository and running `npm i && npm run build && npm run serve`.


### GET /templates
Lists templates with optional filtering and pagination.

**Parameters**:
- `keywords` (optional, string): Comma-separated keywords to filter templates (matches any keyword in `Template.keywords`). Example: `contract,legal`.
- `limit` (optional, integer): Number of templates to return (1-100). Default: 10.
- `page` (optional, integer): Page number for pagination. Default: 1.
- `sortBy` (optional, string): Field to sort by (e.g., `id`, `displayName`). Default: `id`.
- `sortOrder` (optional, string): Sort order (`asc` or `desc`). Default: `asc`.

**Example Request**: GET /templates?keywords=contract,legal&limit=10&page=1