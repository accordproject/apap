import { Response } from 'express';
import { Template as ApTemplate } from '@accordproject/cicero-core';
import AdmZip from "adm-zip";
import { Template } from '../db/schema';

// --- STRICT TYPESCRIPT INTERFACES BASED ON ACCORD PROJECT SOURCE CODE ---
interface ApModelFile {
    namespace: string;
    fileName?: string;
    content?: string;
    definitions?: string;
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
        updateExternalModels(): Promise<void>;
    };
    getScriptManager(): {
        getScripts(): ApScript[];
    };
}
// ------------------------------------------------------------------------

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

    const text:any = db.text;
    zip.addFile("/text/grammar.tem.md", Buffer.from(text.templateText || '', 'utf8'));
    
    const templateModel:Record<string,any> = db.templateModel;
    const domainModel:Record<string,any> = templateModel.model;
    if(domainModel.$class === 'org.accordproject.protocol@1.0.0.CtoModel') {
        domainModel.ctoFiles.forEach((data:any, index:number) => {
            if(typeof data === 'string') {
                zip.addFile(`/model/model${index}.cto`, Buffer.from(data, 'utf8'));
            } else {
                const filename = data.filename || `model${index}.cto`;
                zip.addFile(`/model/${filename}`, Buffer.from(data.contents || '', 'utf8'));
            }
        });
    } else {
        throw new Error('Model type is not supported');
    }

const logic:Record<string,any> = db.logic;
    if(logic && logic.codes) {
        logic.codes.forEach((code:any) => {
           // FIXED: Prevent the double "logic/logic/" nested folder bug!
           const filePath = code.id.startsWith('logic/') ? code.id : `logic/${code.id}`;
           zip.addFile(filePath, Buffer.from(code.value || '', 'utf8'));
        });
    }

    const buffer = zip.toBuffer();
    const template = await ApTemplate.fromArchive(buffer);
    await template.getModelManager().updateExternalModels();
    return template;
}

export function extractTemplateForDatabase(apTemplate: any, uri: string, hash: string) {
    const packageJson = apTemplate.getMetadata().getPackageJson();
    const templateText = apTemplate.getTemplate() || '';

    // Extract Models using the verified ModelFile.js methods
    const ctoFiles = apTemplate.getModelManager().getModels().map((file: any, index: number) => {
        let filename = `model${index}.cto`; // Safe fallback
        if (typeof file.getNamespace === 'function' && file.getNamespace()) {
            filename = `${file.getNamespace()}.cto`;
        }
        
        let contents = '';
        if (typeof file.getDefinitions === 'function') {
            contents = file.getDefinitions();
        } else {
            contents = file.definitions || file.content || '';
        }
        return { filename, contents };
    });

    // Extract Scripts using the verified ScriptManager.js methods
    const logicCodes = apTemplate.getScriptManager().getScripts().map((file: any) => {
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