import { assertAllowedUrl } from './allowlist';

describe('assertAllowedUrl SSRF guard', () => {
    it('accepts valid https URLs from models.accordproject.org', () => {
        const result = assertAllowedUrl('https://models.accordproject.org/patron/model.cto');
        expect(result).toEqual({
            host: 'models.accordproject.org',
            pathname: '/patron/model.cto',
            search: ''
        });
    });

    it('accepts valid https URLs from templates.accordproject.org', () => {
        const result = assertAllowedUrl('https://templates.accordproject.org/latedeliveryandpenalty@0.1.0.cta');
        expect(result).toEqual({
            host: 'templates.accordproject.org',
            pathname: '/latedeliveryandpenalty@0.1.0.cta',
            search: ''
        });
    });

    it('accepts valid https URLs from raw.githubusercontent.com under accordproject org', () => {
        const result = assertAllowedUrl('https://raw.githubusercontent.com/accordproject/cicero-template-library/main/archives/latedeliveryandpenalty.cta');
        expect(result).toEqual({
            host: 'raw.githubusercontent.com',
            pathname: '/accordproject/cicero-template-library/main/archives/latedeliveryandpenalty.cta',
            search: ''
        });
    });

    it('preserves query search parameters on valid URLs', () => {
        const result = assertAllowedUrl('https://models.accordproject.org/patron/model.cto?version=1.0');
        expect(result.search).toBe('?version=1.0');
    });

    it('rejects plaintext http scheme', () => {
        expect(() => assertAllowedUrl('http://templates.accordproject.org/test.cta'))
            .toThrow('Invalid URI scheme. Only https is allowed.');
    });

    it('rejects file://, ftp://, or other non-https schemes', () => {
        expect(() => assertAllowedUrl('file:///etc/passwd'))
            .toThrow('Invalid URI scheme. Only https is allowed.');
        expect(() => assertAllowedUrl('ftp://templates.accordproject.org/test.cta'))
            .toThrow('Invalid URI scheme. Only https is allowed.');
    });

    it('rejects malformed URLs', () => {
        expect(() => assertAllowedUrl('https://'))
            .toThrow('Malformed URL provided.');
    });

    it('rejects URLs containing user credentials, including encoded userinfo variants', () => {
        expect(() => assertAllowedUrl('https://admin:secret@templates.accordproject.org/test.cta'))
            .toThrow('SSRF Prevention: User credentials in URL are not allowed.');
        expect(() => assertAllowedUrl('https://templates.accordproject.org%00@evil.com/test.cta'))
            .toThrow('SSRF Prevention: User credentials in URL are not allowed.');
    });

    it('rejects URLs using custom non-443 ports', () => {
        expect(() => assertAllowedUrl('https://templates.accordproject.org:8443/test.cta'))
            .toThrow('SSRF Prevention: Custom ports are not allowed.');
        expect(() => assertAllowedUrl('https://templates.accordproject.org:80/test.cta'))
            .toThrow('SSRF Prevention: Custom ports are not allowed.');
    });

    it('allows default port 443 explicitly or implicitly', () => {
        expect(() => assertAllowedUrl('https://templates.accordproject.org:443/test.cta'))
            .not.toThrow();
        expect(() => assertAllowedUrl('https://templates.accordproject.org/test.cta'))
            .not.toThrow();
    });

    it('rejects arbitrary external domains not in allowlist', () => {
        expect(() => assertAllowedUrl('https://evil.com/malicious.cta'))
            .toThrow('SSRF Prevention: Domain not in allowlist.');
        expect(() => assertAllowedUrl('https://169.254.169.254/latest/meta-data/'))
            .toThrow('SSRF Prevention: Domain not in allowlist.');
        expect(() => assertAllowedUrl('https://localhost:443/test.cta'))
            .toThrow('SSRF Prevention: Domain not in allowlist.');
    });

    it('rejects raw.githubusercontent.com URLs outside the accordproject organization', () => {
        expect(() => assertAllowedUrl('https://raw.githubusercontent.com/malicious-user/repo/main/exploit.cta'))
            .toThrow('SSRF Prevention: Only official accordproject GitHub repositories are allowed.');
    });
});
