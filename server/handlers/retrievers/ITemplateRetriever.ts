export interface ITemplateRetriever {
    /**
     * Fetches a template archive (.cta) from a given URI.
     * @param uri The external location of the template
     * @returns A Promise resolving to the binary Buffer of the .cta file
     */
    fetch(uri: string): Promise<Buffer>;
}