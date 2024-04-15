# Wait Until

wait-until is a script and a library to wait and poll until a condition is met,
then execute the onSuccess callback.

If it never succeeds during the retry count and delays, the onFailure will execute.

See pollUntil for usage

## CLI
deno install --allow-run --allow-read --allow-env -g main.ts
