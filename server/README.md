# Reference Implementation

This is the reference implementation of an Accord Project Agreement Protocol (APAP) Server.

## Running

```bash
npm i
npm start
```

## API Routes

The API is mounted at the `/` root path and can be accessed via cURL (or Postman/Insomnia or similar).

```bash
curl --request GET \
  --url http://localhost:9000/capabilities
```