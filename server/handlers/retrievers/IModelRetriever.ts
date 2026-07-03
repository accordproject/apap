export interface IModelRetriever {
    getURISchemes(): string[];
    fetchModel(uri: string): Promise<string>;
}