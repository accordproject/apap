/**
 * Utility code to merge an Open API document (generated for Concerto resources)
 * with a fragment of an Open API document that defines additional paths.
 */
const fs = require('fs');

const base = fs.readFileSync('./output/openapi.json', 'utf8');
const baseJson = JSON.parse(base);

const extra = fs.readFileSync('./openapi-extra-paths.json', 'utf8');
const extraJson = JSON.parse(extra);

const mergedPaths = {};

Object.keys(baseJson.paths).forEach(pathKey => {
    mergedPaths[pathKey] = baseJson.paths[pathKey];
});

Object.keys(extraJson.paths).forEach(pathKey => {
    mergedPaths[pathKey] = extraJson.paths[pathKey];
});

const merged = {
    ...baseJson
};

merged.paths = mergedPaths;
fs.writeFileSync('./openapi.json', JSON.stringify(merged, null, 2));