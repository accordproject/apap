#!/usr/bin/env node

/**
 * Script to convert an Accord Project template directory into a JSON file
 * in the org.accordproject.protocol@1.0.0.Template format for POST /templates/
 *
 * Usage:
 *   node export-template.js <template-directory> <output-json-file>
 */

const fs = require('fs');
const path = require('path');
const { Template } = require('@accordproject/cicero-core');

async function main() {
  const [,, templateDir, outputFile] = process.argv;
  if (!templateDir || !outputFile) {
    console.error('Usage: node export-template.js <template-directory> <output-json-file>');
    process.exit(1);
  }

  if (!fs.existsSync(templateDir)) {
    console.error(`Error: Template directory "${templateDir}" does not exist`);
    process.exit(1);
  }

  try {
    // Load the template using Cicero API
    console.log(`Loading template from directory: ${templateDir}`);
    const template = await Template.fromDirectory(templateDir);
    
    // Get metadata from template
    const metadata = template.getMetadata();
    const packageJson = metadata.getPackageJson();
    
    // Get model manager and extract template type info
    const modelManager = template.getModelManager();
    await modelManager.updateExternalModels();
    
    const templateModelType = template.getTemplateModel();
    const fullyQualifiedTypeName = templateModelType.getFullyQualifiedName();
    
    // Get all CTO model files
    const modelFiles = modelManager.getModelFiles();
    const ctoFiles = modelFiles.map(mf => ({
      $class: 'org.accordproject.protocol@1.0.0.CtoFile',
      contents: mf.definitions,
      filename: mf.fileName || `${mf.namespace}.cto`
    }));
    
    // Get template text (grammar)
    const templateText = template.getTemplate();
    
    // Get logic files
    let logic = null;
    const scriptManager = template.getScriptManager();
    const scripts = scriptManager.getScripts();
    
    if (scripts && scripts.length > 0) {
      const codes = scripts
      .filter(
        script => !script.identifier.startsWith('logic/generated')
      ).map(script => ({
        $class: 'org.accordproject.protocol@1.0.0.Code',
        id: script.identifier,
        type: script.getLanguage() === 'typescript' ? 'TYPESCRIPT' : 'ES2015',
        encoding: 'PLAIN_TEXT',
        value: script.getContents()
      }));
      
      logic = {
        $class: 'org.accordproject.protocol@1.0.0.Logic',
        codes: codes
      };
      
      // Get state type if defined
      const stateTypes = template.getStateTypes();
      if (stateTypes) {
        logic.stateType = stateTypes[0];
      }
    }
    
    // Read sample request if available
    let sampleRequest = null;
    const requestPath = path.join(templateDir, 'request.json');
    if (fs.existsSync(requestPath)) {
      sampleRequest = fs.readFileSync(requestPath, 'utf8');
    }
    
    // Generate URI
    const templateName = packageJson.name || path.basename(templateDir);
    const uri = packageJson.uri || `resource:org.accordproject.protocol@1.0.0.Template#${templateName}`;
    
    // Get author - handle string or object format
    let author = '';
    if (typeof packageJson.author === 'string') {
      author = packageJson.author;
    } else if (packageJson.author && packageJson.author.name) {
      author = packageJson.author.name;
    }
    
    const accordproject = packageJson.accordproject || {};
    
    // Compose the Template JSON - all required fields per protocol.cto
    const templateJson = {
      $class: 'org.accordproject.protocol@1.0.0.Template',
      uri: uri,
      author: author || 'Unknown',
      displayName: packageJson.displayName || packageJson.name || templateName,
      version: packageJson.version || '1.0.0',
      description: packageJson.description,
      license: packageJson.license || 'Apache-2.0',
      // keywords: packageJson.keywords || [],
      metadata: {
        $class: 'org.accordproject.protocol@1.0.0.TemplateMetadata',
        runtime: accordproject.runtime || 'typescript',
        template: accordproject.template || 'clause',
        cicero: accordproject.cicero || '^0.25.0'
      },
      logo: null,
      templateModel: {
        $class: 'org.accordproject.protocol@1.0.0.TemplateModel',
        typeName: fullyQualifiedTypeName,
        model: {
          $class: 'org.accordproject.protocol@1.0.0.CtoModel',
          ctoFiles: ctoFiles
        }
      },
      text: {
        $class: 'org.accordproject.protocol@1.0.0.Text',
        templateText: templateText
      },
      logic: logic,
      sampleRequest: sampleRequest
    };

    fs.writeFileSync(outputFile, JSON.stringify(templateJson, null, 2), 'utf8');
    console.log(`✓ Template exported to ${outputFile}`);
    console.log(`  URI: ${uri}`);
    console.log(`  Type: ${fullyQualifiedTypeName}`);
    console.log(`  Model files: ${ctoFiles.length}`);
    console.log(`  Logic: ${logic ? 'Yes' : 'No'}`);
    console.log(`  Sample request: ${sampleRequest ? 'Yes' : 'No'}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
