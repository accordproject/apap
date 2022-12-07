# Accord Project Agreement Protocol Specification — 1.0.0

This document describes the 1.0.x version of the language server protocol. An implementation for node of the 1.0.x version of the protocol can be found here.

Note: edits to this specification can be made via a pull request against this markdown document.

## Open API

The protocol is defined via an Open API document, which specified the required API methods as well as their expected request and response data formats.

### Resource Paths

#### /templates

GET, POST

#### /templates/{name}

GET, PUT, DELETE

#### /agreements

GET, POST

#### /agreements/{agreementId}

GET, PUT, DELETE

### Data Models

#### Template

#### Agreement