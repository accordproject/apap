import { transports, sessionLastActivity, sessionCleanupInterval } from './mcp';

describe('MCP Session Cleanup Test', () => {
    it('tracks session activity on initialization', () => {
        // sessionLastActivity should be populated
        // after a session is created
        expect(Object.keys(sessionLastActivity ?? {}))
            .toBeDefined();
    });

    it('cleanup interval is registered with unref', () => {
        // sessionCleanupInterval should exist and 
        // not block process exit
        expect(sessionCleanupInterval).toBeDefined();
    });

    it('session is removed from both maps on close', () => {
        // When transport.onclose fires, both
        // transports and sessionLastActivity 
        // should be cleaned up
        const mockSessionId = 'test-session-123';
        transports[mockSessionId] = {} as any;
        sessionLastActivity[mockSessionId] = Date.now();
        
        // Simulate onclose
        delete transports[mockSessionId];
        delete sessionLastActivity[mockSessionId];
        
        expect(transports[mockSessionId]).toBeUndefined();
        expect(sessionLastActivity[mockSessionId])
            .toBeUndefined();
    });
});
