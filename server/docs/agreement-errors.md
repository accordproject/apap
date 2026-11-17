# Agreement execution errors

Expected input and authorization errors help clients correct a request. A
scope denial includes the required scope. Unexpected infrastructure failures
receive a generic client response; the server logs the original error for
operators and those logs may contain sensitive information.

Template logic can raise business-rule errors. The current template runtime
does not provide a trusted type that distinguishes those errors from internal
exceptions. Their messages are therefore not currently returned by the REST
trigger error boundary. A typed contract for safe business errors requires
maintainer agreement before those messages can be exposed safely.
