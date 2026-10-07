import type { ServerNotifier } from '@modelcontextprotocol/server';

// Services call `getNotifier()` from write paths to publish
// `notifications/resources/updated` on the shared MCP event bus. The real
// notifier is installed by `handlers/mcp.ts::createMcpRouter(db)` at startup
// via `setNotifier`; before that call (and in unit tests that exercise a
// service without wiring the MCP router) a no-op notifier is returned.
//
// This indirection keeps the service layer transport-agnostic: a service
// never imports from `handlers/`, which preserves the invariant proven in
// `apap-mcp-poc` that services call the same code path whether invoked by
// REST or MCP. See apap/CLAUDE.md's "Architecture invariants" section.

const NOOP_NOTIFIER: ServerNotifier = {
    toolsChanged() { /* no-op */ },
    promptsChanged() { /* no-op */ },
    resourcesChanged() { /* no-op */ },
    resourceUpdated(_uri: string) { /* no-op */ },
};

let notifier: ServerNotifier | undefined;
let warnedOnce = false;

export function setNotifier(n: ServerNotifier): void {
    notifier = n;
}

export function getNotifier(): ServerNotifier {
    if (!notifier) {
        if (!warnedOnce) {
            console.warn({
                type: 'notifier_uninitialized',
                message: 'MCP notifier not set; subscriptions/listen fan-out is a no-op (expected in unit tests, not in production)',
            });
            warnedOnce = true;
        }
        return NOOP_NOTIFIER;
    }
    return notifier;
}

/** @internal Test helper: reset the singleton between test suites. */
export function resetNotifier(): void {
    notifier = undefined;
    warnedOnce = false;
}
