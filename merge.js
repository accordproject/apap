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

// A path present on both sides is merged key by key (get/put/parameters/...),
// and an operation on both sides is merged field by field, instead of the extra
// path replacing the generated one wholesale: adding a query param to a
// generated path previously dropped its other operations. Arrays (e.g. an
// operation's `parameters`) are replaced by the extra side, not concatenated,
// so an extra entry that declares `parameters` must list every parameter the
// operation should have.
const isObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);

Object.keys(extraJson.paths).forEach(pathKey => {
    const basePath = mergedPaths[pathKey];
    const extraPath = extraJson.paths[pathKey];
    if (!basePath) {
        mergedPaths[pathKey] = extraPath;
        return;
    }
    const mergedPath = { ...basePath };
    Object.keys(extraPath).forEach(key => {
        mergedPath[key] = isObject(basePath[key]) && isObject(extraPath[key])
            ? { ...basePath[key], ...extraPath[key] }
            : extraPath[key];
    });
    mergedPaths[pathKey] = mergedPath;
});

const merged = {
    ...baseJson
};

merged.paths = mergedPaths;
merged.info.title = 'Accord Protocol';
merged.info.description = 'API for document generation and agreement automation';
fs.writeFileSync('./openapi.json', JSON.stringify(merged, null, 2));