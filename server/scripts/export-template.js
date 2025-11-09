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

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return null;
  }
}

/**
 * Extract the template model type name from the model.cto file
 */
function extractTypeName(ctoContent) {
  if (!ctoContent) return 'TemplateModel';
  
  // Look for @template annotation followed by asset declaration
  const templateRegex = /@template\s+asset\s+(\w+)/;
  const match = ctoContent.match(templateRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return 'TemplateModel';
}

/**
 * Extract namespace from the model.cto file
 */
function extractNamespace(ctoContent) {
  if (!ctoContent) return null;
  
  const namespaceRegex = /namespace\s+([\w.@]+)/;
  const match = ctoContent.match(namespaceRegex);
  
  return match ? match[1] : null;
}

/**
 * Generate a fully qualified type name
 */
function getFullyQualifiedTypeName(namespace, typeName) {
  return namespace ? `${namespace}.${typeName}` : typeName;
}

function main() {
  const [,, templateDir, outputFile] = process.argv;
  if (!templateDir || !outputFile) {
    console.error('Usage: node export-template.js <template-directory> <output-json-file>');
    process.exit(1);
  }

  if (!fs.existsSync(templateDir)) {
    console.error(`Error: Template directory "${templateDir}" does not exist`);
    process.exit(1);
  }

  // Read package.json for metadata
  const pkgPath = path.join(templateDir, 'package.json');
  const pkgContent = readFileIfExists(pkgPath);
  
  if (!pkgContent) {
    console.error(`Error: package.json not found in ${templateDir}`);
    process.exit(1);
  }
  
  const pkg = JSON.parse(pkgContent);
  const accordproject = pkg.accordproject || {};

  // Read model (CTO) files
  const modelDir = path.join(templateDir, 'model');
  let ctoFiles = [];
  let mainModelContent = null;
  let namespace = null;
  
  if (fs.existsSync(modelDir)) {
    const files = fs.readdirSync(modelDir)
      .filter(f => f.endsWith('.cto'))
      .sort((a, b) => {
        // Put model.cto first if it exists
        if (a === 'model.cto') return -1;
        if (b === 'model.cto') return 1;
        return a.localeCompare(b);
      });
    
    ctoFiles = files.map(f => {
      const contents = readFileIfExists(path.join(modelDir, f));
      
      // Extract info from main model file
      if (f === 'model.cto') {
        mainModelContent = contents;
        namespace = extractNamespace(contents);
      }
      
      return {
        $class: 'org.accordproject.protocol@1.0.0.CtoFile',
        contents: contents,
        filename: f
      };
    });
  }

  if (ctoFiles.length === 0) {
    console.error(`Error: No .cto model files found in ${modelDir}`);
    process.exit(1);
  }

  // Determine the type name
  const typeName = extractTypeName(mainModelContent);
  const fullyQualifiedTypeName = getFullyQualifiedTypeName(namespace, typeName);

  // Read template text
  const templateMd = 
    readFileIfExists(path.join(templateDir, 'text/grammar.tem.md')) ||
    readFileIfExists(path.join(templateDir, 'text/grammar.md')) ||
    readFileIfExists(path.join(templateDir, 'grammar.tem.md')) ||
    readFileIfExists(path.join(templateDir, 'template.md')) ||
    '';

  if (!templateMd) {
    console.warn('Warning: No template text found');
  }

  // Read logic (TypeScript or Ergo)
  let logic = null;
  const logicDir = path.join(templateDir, 'logic');
  if (fs.existsSync(logicDir)) {
    const logicFiles = fs.readdirSync(logicDir)
      .filter(f => f.endsWith('.ts') || f.endsWith('.ergo'))
      .filter(f => !f.includes('generated')); // Skip generated files
    
    if (logicFiles.length > 0) {
      const codes = logicFiles.map(f => ({
        $class: 'org.accordproject.protocol@1.0.0.Code',
        id: f,
        type: f.endsWith('.ts') ? 'TYPESCRIPT' : 'ES2015',
        encoding: 'PLAIN_TEXT',
        value: readFileIfExists(path.join(logicDir, f))
      }));
      
      logic = {
        $class: 'org.accordproject.protocol@1.0.0.Logic',
        codes: codes
      };
      
      // Try to detect state type
      const mainLogicFile = logicFiles[0];
      const logicContent = readFileIfExists(path.join(logicDir, mainLogicFile));
      if (logicContent && logicContent.includes('State')) {
        // Look for state type in the logic
        const stateMatch = logicContent.match(/I(\w+State)/);
        if (stateMatch && namespace) {
          logic.stateType = `${namespace}.${stateMatch[1]}`;
        }
      }
    }
  }

  // Read sample request if available
  let sampleRequest = null;
  const requestPath = path.join(templateDir, 'request.json');
  const requestContent = readFileIfExists(requestPath);
  if (requestContent) {
    try {
      sampleRequest = requestContent; // Store as JSON string per protocol
    } catch (e) {
      console.warn(`Warning: Invalid JSON in request.json: ${e.message}`);
    }
  }

  // Generate URI if not provided
  const templateName = pkg.name || path.basename(templateDir);
  const uri = pkg.uri || `resource:org.accordproject.protocol@1.0.0.Template#${templateName}`;

  // Get author - handle string or object format
  let author = '';
  if (typeof pkg.author === 'string') {
    author = pkg.author;
  } else if (pkg.author && pkg.author.name) {
    author = pkg.author.name;
  }

  // Compose the Template JSON - all required fields per protocol.cto
  const templateJson = {
    $class: 'org.accordproject.protocol@1.0.0.Template',
    uri: uri,
    author: author || 'Unknown',
    displayName: pkg.displayName || pkg.name || templateName,
    version: pkg.version || '1.0.0',
    description: pkg.description,
    license: pkg.license || 'Apache-2.0',
    keywords: pkg.keywords,
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
      templateText: templateMd
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
}

main();
