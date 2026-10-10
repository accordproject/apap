import { jest } from '@jest/globals';
import type { ServerNotifier } from '@modelcontextprotocol/server';
import { getNotifier, setNotifier, resetNotifier } from './notify';

describe('services/notify singleton', () => {
    let warnSpy: jest.SpiedFunction<typeof console.warn>;

    beforeEach(() => {
        resetNotifier();
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { /* silence */ });
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    it('returns a no-op notifier before setNotifier is called', () => {
        const n = getNotifier();
        // The no-op methods must exist and must not throw. There is no
        // observable side effect to assert beyond "it does not blow up"
        // because that is the whole point of the no-op fallback.
        expect(() => n.resourceUpdated('apap://templates/1')).not.toThrow();
        expect(() => n.toolsChanged()).not.toThrow();
        expect(() => n.promptsChanged()).not.toThrow();
        expect(() => n.resourcesChanged()).not.toThrow();
    });

    it('emits exactly one warning across repeated getNotifier calls when unset', () => {
        getNotifier();
        getNotifier();
        getNotifier();

        expect(warnSpy).toHaveBeenCalledTimes(1);
        const [call] = warnSpy.mock.calls;
        expect(call[0]).toMatchObject({
            type: 'notifier_uninitialized',
        });
    });

    it('setNotifier installs the real notifier and silences the warning', () => {
        const spy = jest.fn();
        const real: ServerNotifier = {
            toolsChanged() { /* unused */ },
            promptsChanged() { /* unused */ },
            resourcesChanged() { /* unused */ },
            resourceUpdated: spy as (uri: string) => void,
        };

        setNotifier(real);

        getNotifier().resourceUpdated('apap://templates/42');

        expect(spy).toHaveBeenCalledWith('apap://templates/42');
        expect(warnSpy).not.toHaveBeenCalled();
    });

    it('resetNotifier returns to the no-op fallback and re-arms the warning', () => {
        setNotifier({
            toolsChanged() { /* unused */ },
            promptsChanged() { /* unused */ },
            resourcesChanged() { /* unused */ },
            resourceUpdated() { /* unused */ },
        });
        resetNotifier();

        getNotifier();
        getNotifier();

        // Reset re-arms warnedOnce, so a fresh unset call warns again.
        expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it('does not swallow uri values: setNotifier.resourceUpdated receives the exact string', () => {
        const captured: string[] = [];
        setNotifier({
            toolsChanged() { /* unused */ },
            promptsChanged() { /* unused */ },
            resourcesChanged() { /* unused */ },
            resourceUpdated(uri: string) { captured.push(uri); },
        });

        getNotifier().resourceUpdated('apap://agreements/7');
        getNotifier().resourceUpdated('apap://templates/9');

        expect(captured).toEqual(['apap://agreements/7', 'apap://templates/9']);
    });
});
