import { Template as ApTemplate } from '@accordproject/cicero-core';
import AdmZip from "adm-zip";
import { Template } from '../db/schema';

interface ApModelFile {
    getNamespace?(): string;
    getDefinitions?(): string;
    definitions?: string;
    content?: string;
}

interface ApScript {
    getIdentifier(): string;
    contents: string;
}

interface ApTemplateInstance {
    getMetadata(): {
        getPackageJson(): Record<string, any>;
    };
    getTemplate(): string | null;
    getModelManager(): {
        getModels(): ApModelFile[];
        updateExternalModels?(): Promise<void>;
    };
    getScriptManager(): {
        getScripts(): ApScript[];
    };
}

export async function templateFromDatabase(db: typeof Template | any): Promise<ApTemplate> {
    const zip = new AdmZip();
    
    let templateName = 'dynamic-template';
    const uriString = db.uri ? db.uri.toString() : '';
    
    if (uriString.includes('#')) {
        templateName = uriString.split('#').pop() || templateName;
    } else {
        templateName = uriString.split('/').pop()?.replace('.cta', '') || templateName;
    }

    const packageJson = {
        name: templateName,
        version: db.version || '1.0.0',
        author: db.author || 'Unknown',
        license: db.license || 'Unknown',
        description: db.description || '',
        accordproject: db.metadata || {}
    };
    
    zip.addFile("package.json", Buffer.from(JSON.stringify(packageJson), 'utf8'));

    const text: Record<string, any> = db.text;
    zip.addFile("/text/grammar.tem.md", Buffer.from(text.templateText || '', 'utf8'));
    
    const templateModel: Record<string, any> = db.templateModel;
    const domainModel: Record<string, any> = templateModel.model;
    
    if (domainModel.$class === 'org.accordproject.protocol@1.0.0.CtoModel') {
        domainModel.ctoFiles.forEach((data: any, index: number) => {
            if (typeof data === 'string') {
                zip.addFile(`/model/model${index}.cto`, Buffer.from(data, 'utf8'));
            } else {
                const filename = data.filename || `model${index}.cto`;
                zip.addFile(`/model/${filename}`, Buffer.from(data.contents || '', 'utf8'));
            }
        });
    } else {
        throw new Error('Model type is not supported');
    }

    const logic: Record<string, any> = db.logic;
    if (logic && logic.codes) {
        logic.codes.forEach((code: any) => {
           const filePath = code.id.startsWith('logic/') ? code.id : `logic/${code.id}`;
           zip.addFile(filePath, Buffer.from(code.value || '', 'utf8'));
        });
    }

    const buffer = zip.toBuffer();
    const template = await ApTemplate.fromArchive(buffer);
    await template.getModelManager().updateExternalModels();
    return template;
}

export function extractTemplateForDatabase(apTemplate: ApTemplateInstance, uri: string, hash: string) {
    const packageJson = apTemplate.getMetadata().getPackageJson();
    const templateText = apTemplate.getTemplate() || '';

    const ctoFiles = apTemplate.getModelManager().getModels().map((file: ApModelFile, index: number) => {
        let filename = `model${index}.cto`; 
        
        if (typeof file.getNamespace === 'function' && file.getNamespace()) {
            filename = `${file.getNamespace()}.cto`;
        }
        
        let contents = '';
        if (typeof file.getDefinitions === 'function') {
            contents = file.getDefinitions() || '';
        } else {
            contents = file.definitions || file.content || '';
        }
        return { filename, contents };
    });

    const logicCodes = apTemplate.getScriptManager().getScripts().map((file: ApScript) => {
        return {
            id: file.getIdentifier(),
            value: file.contents || ''
        };
    });
    
    return {
        uri: uri,
        hash: hash,
        author: packageJson.author || 'Unknown',
        version: packageJson.version || '1.0.0',
        description: packageJson.description || '',
        license: packageJson.license || 'Unknown',
        displayName: packageJson.displayName || null,
        keywords: packageJson.keywords || null,
        logo: packageJson.logo || null,
        sampleRequest: packageJson.sampleRequest || null,
        metadata: packageJson.accordproject || {},
        templateModel: { 
            model: { 
                $class: 'org.accordproject.protocol@1.0.0.CtoModel', 
                ctoFiles: ctoFiles 
            } 
        },
        text: { templateText: templateText },
        logic: { codes: logicCodes }
    };
}