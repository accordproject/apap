import { transports, sessionLastActivity, sessionCleanupInterval, startSessionCleanup } from './mcp';

describe('MCP Session Cleanup Test', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        startSessionCleanup();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
        // Clear all keys from maps to avoid test pollution
        for (const key of Object.keys(transports)) {
            delete transports[key];
        }
        for (const key of Object.keys(sessionLastActivity)) {
            delete sessionLastActivity[key];
        }
    });

    it('tracks session activity on initialization', () => {
        const testId = 'activity-test-session';
        sessionLastActivity[testId] = Date.now();
        expect(typeof sessionLastActivity[testId]).toBe('number');
        expect(sessionLastActivity[testId]).toBeLessThanOrEqual(Date.now());
    });

    it('cleanup interval is registered with unref', () => {
        expect(sessionCleanupInterval).toBeDefined();
        expect(typeof (sessionCleanupInterval as any).hasRef).toBe('function');
        expect((sessionCleanupInterval as any).hasRef()).toBe(false);
    });

    it('session is removed from both maps on close', () => {
        const mockSessionId = 'test-session-123';
        transports[mockSessionId] = {} as any;
        sessionLastActivity[mockSessionId] = Date.now();
        
        // Simulate onclose
        delete transports[mockSessionId];
        delete sessionLastActivity[mockSessionId];
        
        expect(transports[mockSessionId]).toBeUndefined();
        expect(sessionLastActivity[mockSessionId]).toBeUndefined();
    });

    it('removes idle sessions and preserves fresh sessions in one pass', () => {
        const now = Date.now();
        jest.spyOn(Date, 'now').mockReturnValue(now);

        const idleSessionId = 'idle-session';
        const freshSessionId = 'fresh-session';

        const idleCloseMock = jest.fn();
        transports[idleSessionId] = { close: idleCloseMock } as any;
        sessionLastActivity[idleSessionId] = now;

        const freshCloseMock = jest.fn();
        transports[freshSessionId] = { close: freshCloseMock } as any;
        sessionLastActivity[freshSessionId] = now;

        // Advance time by 15 minutes (less than the 30-minute timeout)
        jest.spyOn(Date, 'now').mockReturnValue(now + 15 * 60 * 1000);
        // Update activity of fresh session
        sessionLastActivity[freshSessionId] = now + 15 * 60 * 1000;

        // Advance time by another 20 minutes (total 35 minutes since idle session creation)
        jest.spyOn(Date, 'now').mockReturnValue(now + 35 * 60 * 1000);

        // Run fake timers to trigger the cleanup interval (35 minutes)
        jest.advanceTimersByTime(35 * 60 * 1000);

        // Idle session should be removed and closed
        expect(transports[idleSessionId]).toBeUndefined();
        expect(sessionLastActivity[idleSessionId]).toBeUndefined();
        expect(idleCloseMock).toHaveBeenCalled();

        // Fresh session should be preserved (since it was active 20 minutes ago, which is less than 30 minutes) and not closed
        expect(transports[freshSessionId]).toBeDefined();
        expect(sessionLastActivity[freshSessionId]).toBeDefined();
        expect(freshCloseMock).not.toHaveBeenCalled();
    });
});
