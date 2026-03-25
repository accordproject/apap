# Accord Project Agreement Protocol Specification — 1.0.0

This document describes the 1.0.x version of the language server protocol. An implementation for node of the 1.0.x version of the protocol can be found here (TBD).

Note: edits to this specification can be made via a pull request against [this markdown document](specification.md).

## Open API

The protocol is defined via an [Open API document](./openapi.json), which specified the required API methods as well as their expected request and response data formats.

The Open API documentation has been generated in both [markdown format](./index.md), and as a [static HTML site](./_site/index.html) viewable by cloning this repository and running `npm i && npm run build && npm run serve`.