const fs = require('fs');
const spec = JSON.parse(fs.readFileSync('openapi.json', 'utf8'));

function dump(path, method) {
    if (spec.paths[path] && spec.paths[path][method]) {
        console.log(`=== ${method.toUpperCase()} ${path} ===`);
        const p = spec.paths[path][method];
        console.log(`Req Body required: ${p.requestBody?.required}`);
        console.log(`Responses: ${Object.keys(p.responses).join(', ')}`);
    }
}

dump('/templates', 'get');
dump('/templates', 'post');
dump('/templates/{uri}', 'get');
dump('/templates/{uri}', 'put');
dump('/templates/{uri}', 'delete');
