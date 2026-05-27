import type { Request } from 'express';
import { parseQueryParams } from './crud';

function createRequest(query: Request['query']): Request {
    return {
        query
    } as Request;
}

describe('parseQueryParams', () => {
    it('falls back to safe defaults for non-numeric pagination params', () => {
        const queryParams = parseQueryParams(createRequest({
            page: 'abc',
            limit: 'foo'
        }));

        expect(queryParams.page).toBe(1);
        expect(queryParams.limit).toBe(100);
    });

    it('rejects partially numeric and non-decimal pagination values', () => {
        const queryParams = parseQueryParams(createRequest({
            page: '12abc',
            limit: '0x10'
        }));

        expect(queryParams.page).toBe(1);
        expect(queryParams.limit).toBe(100);
    });

    it('uses the first repeated query param and still clamps values', () => {
        const queryParams = parseQueryParams(createRequest({
            page: ['2', '3'],
            limit: ['250', '10'],
            sortBy: ['createdAt', 'updatedAt'],
            sortOrder: ['DESC', 'asc']
        }));

        expect(queryParams.page).toBe(2);
        expect(queryParams.limit).toBe(100);
        expect(queryParams.sortBy).toBe('createdAt');
        expect(queryParams.sortOrder).toBe('desc');
    });
});
