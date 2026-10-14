export function assertAllowedUrl(uri: string): { host: string; pathname: string; search: string } {
    if (!uri.startsWith('https://')) {
        throw new Error(`Invalid URI scheme. Only https is allowed.`);
    }

    let safeUrl: URL;
    try {
        safeUrl = new URL(uri);
    } catch (e) {
        throw new Error(`Malformed URL provided.`);
    }

    if (safeUrl.username || safeUrl.password) {
        throw new Error(`SSRF Prevention: User credentials in URL are not allowed.`);
    }

    if (safeUrl.port !== '' && safeUrl.port !== '443') {
        throw new Error(`SSRF Prevention: Custom ports are not allowed.`);
    }

    const host = safeUrl.hostname;

    if (
        host !== 'models.accordproject.org' &&
        host !== 'templates.accordproject.org' &&
        host !== 'raw.githubusercontent.com'
    ) {
        throw new Error(`SSRF Prevention: Domain not in allowlist.`);
    }

    if (host === 'raw.githubusercontent.com' && !safeUrl.pathname.startsWith('/accordproject/')) {
        throw new Error(`SSRF Prevention: Only official accordproject GitHub repositories are allowed.`);
    }

    return { host: safeUrl.host, pathname: safeUrl.pathname, search: safeUrl.search };
}
