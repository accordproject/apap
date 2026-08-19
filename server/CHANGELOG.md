# Changelog

## Unreleased

### Changed

- Agreement creation now requires `data` to be an object or a JSON string encoding an object.
- `POST /agreements` now returns a typed `422 VALIDATION_ERROR` when a well-formed request fails Concerto validation. Malformed request shapes continue to return `400 INVALID_PAYLOAD`.
