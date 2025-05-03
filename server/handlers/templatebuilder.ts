import { Response } from 'express';
import { Template as ApTemplate } from '@accordproject/cicero-core';
import AdmZip from "adm-zip";
import { Template, } from '../db/schema';

export async function templateFromDatabase(db: typeof Template): Promise<ApTemplate> {
    const zip = new AdmZip();
    const packageJson = {
        name: db.id,
        version: db.version,
        author: db.author,
        license: db.license,
        description: db.description,
        accordproject: db.metadata
    };
    // metadata
    zip.addFile("package.json", Buffer.from(JSON.stringify(packageJson), 'utf8'));

    // text
    const text:any = db.text;
    zip.addFile("/text/grammar.tem.md", Buffer.from(text.templateText, 'utf8'));
    
    // model
    const templateModel:Record<string,any> = db.templateModel;
    const domainModel:Record<string,any> = templateModel.model;
    if(domainModel.$class === 'org.accordproject.protocol@1.0.0.CtoModel') {
        domainModel.ctoFiles.forEach((file:string, index:number) => {
            zip.addFile(`/model/model${index}.cto`, Buffer.from(file, 'utf8'));
        });
    }
    else {
        throw new Error('Model type is not supported')
    }
    const buffer = zip.toBuffer();
    const template = await ApTemplate.fromArchive(buffer);
    // HACK, due to bug in template loader
    await template.getModelManager().updateExternalModels();
    return template;
}