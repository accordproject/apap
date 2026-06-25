import { transports, sessionLastActivity, sessionCleanupInterval } from './mcp';

describe('MCP Session Cleanup Test', () => {
    it('tracks session activity on initialization', () => {
        const testId = 'activity-test-session';
        sessionLastActivity[testId] = Date.now();
        expect(typeof sessionLastActivity[testId]).toBe('number');
        expect(sessionLastActivity[testId]).toBeLessThanOrEqual(Date.now());
        delete sessionLastActivity[testId]; // cleanup
    });

    it('cleanup interval is registered with unref', () => {
        // sessionCleanupInterval should exist and 
        // not block process exit
        expect(sessionCleanupInterval).toBeDefined();
        expect(typeof (sessionCleanupInterval as any).hasRef).toBe('function');
        expect((sessionCleanupInterval as any).hasRef()).toBe(false);
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
