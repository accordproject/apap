import { extractTemplateForDatabase } from './templatebuilder';

describe('Template Builder - extractTemplateForDatabase', () => {
    it('should perfectly extract ALL attributes from a template instance including logo and metadata', () => {
        const mockTemplateInstance = {
            getMetadata: () => ({
                getPackageJson: () => ({
                    author: 'Accord Project Team',
                    version: '2.5.0',
                    description: 'A rigorous test template',
                    license: 'Apache-2.0',
                    displayName: 'Full Feature Template',
                    keywords: ['test', 'complete', 'logo-included'],
                    logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                    sampleRequest: {
                        $class: 'org.test.Request',
                        value: 100
                    },
                    accordproject: {
                        runtime: 'typescript',
                        cicero: '^0.25.0'
                    }
                })
            }),
            getTemplate: () => 'The agreed amount is {{amount}}.',
            getModelManager: () => ({
                getModels: () => [{
                    getNamespace: () => 'org.test.model',
                    getDefinitions: () => 'namespace org.test.model\nconcept Data { o String value }'
                }]
            }),
            getScriptManager: () => ({
                getScripts: () => [{
                    getIdentifier: () => 'logic/main.ts',
                    contents: 'function execute() { return true; }'
                }]
            })
        };

        const testUri = 'https://templates.accordproject.org/full-feature@2.5.0.cta';
        const testHash = 'a1b2c3d4e5f6g7h8i9j0';

        const result = extractTemplateForDatabase(mockTemplateInstance as any, testUri, testHash);

        expect(result.uri).toBe(testUri);
        expect(result.hash).toBe(testHash);
        
        expect(result.author).toBe('Accord Project Team');
        expect(result.version).toBe('2.5.0');
        expect(result.description).toBe('A rigorous test template');
        expect(result.license).toBe('Apache-2.0');
        expect(result.displayName).toBe('Full Feature Template');
        expect(result.keywords).toEqual(['test', 'complete', 'logo-included']);
        
        expect(result.logo).toBe('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        
        expect(result.sampleRequest).toEqual({ $class: 'org.test.Request', value: 100 });
        expect(result.metadata).toEqual({ runtime: 'typescript', cicero: '^0.25.0' });
        
        expect(result.text.templateText).toBe('The agreed amount is {{amount}}.');
        
        expect(result.templateModel.model.$class).toBe('org.accordproject.protocol@1.0.0.CtoModel');
        expect(result.templateModel.model.ctoFiles).toHaveLength(1);
        expect(result.templateModel.model.ctoFiles[0].filename).toBe('org.test.model.cto');
        expect(result.templateModel.model.ctoFiles[0].contents).toContain('namespace org.test.model');
        
        expect(result.logic.codes).toHaveLength(1);
        expect(result.logic.codes[0].id).toBe('logic/main.ts');
        expect(result.logic.codes[0].value).toContain('function execute()');
    });
});