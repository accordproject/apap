# Accord Project Agreement Protocol

The Accord Project Agreement Protocol (APAP) defines the protocol used between a document generation engine or contract management platform and an agreement server that provides agreement features like template management, document generation, format conversion etc.

## What is the Agreement Protocol?

Adding features like document generation, data format conversion for a document generation template language takes significant effort. Traditionally this work had to be repeated for each template format, as each format provides different APIs for implementing the same feature.

An Agreement Server is meant to provide the template-specific smarts and communicate with agreement tools over a protocol that enables inter-process communication.

The idea behind the Agreement Protocol (APAP) is to standardize the protocol for how such servers and agreement tools communicate. This way, a single Agreement Server can be re-used in multiple agreement tools, which in turn can support multiple templates with minimal effort.

AAP is a win for both template providers and agreement tooling vendors!

## How it Works

An agreement server runs as a separate process and agreement tools communicate with the server using the agreement protocol over JSON-RPC. Below is an example for how a tool and an agreement server communicate during a routine document generation session:

```mermaid
sequenceDiagram
    participant T as Tool
    participant S as Agreement Server
    T->>S: Deploy Template
    S->>T: Template ID
    T->>S: Create Agreement with Data
    S->>T: Agreement ID
    T->>S: Convert Agreement to PDF
    S->>T: PDF Bytes
    T->>S: Destroy Agreement
    S->>T: ACK
```
## Capabilities

Not every agreement server can support all features defined by the protocol. AAP therefore provides ‘capabilities’. A capability groups a set of agreement features. An agreement tool and the agreement server announce their supported features using capabilities.

Notice the actual integration of an agreement server into a particular tool is not defined by the agreement server protocol and is left to the tool implementors.

## Libraries (SDKs) for AAP providers and consumers

To simplify the implementation of agreement servers and clients, there are libraries or SDKs:

Development tool SDKs each development tool typically provides a library for integrating language servers. For example, for JavaScript/TypeScript there is the agreement client npm module.

Language Server SDKs for the different implementation languages there is an SDK to implement a language server in a particular language. For example, to implement a language server using Node.js there is the agreement server npm module.
