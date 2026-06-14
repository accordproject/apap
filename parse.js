const fs = require('fs');
const spec = JSON.parse(fs.readFileSync('openapi.json', 'utf8'));
Object.keys(spec.paths || {}).forEach(path => {
    Object.keys(spec.paths[path]).forEach(method => {
        console.log(`${method.toUpperCase()} ${path}`);
    });
});
