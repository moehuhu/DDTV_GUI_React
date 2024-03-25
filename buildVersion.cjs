const fs = require('fs');
const ini = require('ini');
const packageJson = require('./package.json');

const version = packageJson.version;

const iniData = { version: `v${version}` };

const iniContent = ini.stringify(iniData);

fs.writeFileSync('dist/version.ini', iniContent, 'utf-8');