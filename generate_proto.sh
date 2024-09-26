const pbjs = require('protobufjs-cli/pbjs');
const pbts = require('protobufjs-cli/pbts');
const path = require('path');
const fs = require('fs');

const inputFile = path.join(__dirname, 'protos', 'frames.proto');
const outputJSFile = path.join(__dirname, 'generated', 'frames.js');
const outputTSFile = path.join(__dirname, 'generated', 'frames.d.ts');

// Ensure the output directory exists
if (!fs.existsSync(path.dirname(outputJSFile))) {
  fs.mkdirSync(path.dirname(outputJSFile), { recursive: true });
}

// Generate JavaScript
pbjs.main(['--target', 'static-module', '--wrap', 'commonjs', '--out', outputJSFile, inputFile], function(err) {
  if (err) throw err;

  console.log('JavaScript generated successfully.');

  // Generate TypeScript definitions
  pbts.main(['--out', outputTSFile, outputJSFile], function(err) {
    if (err) throw err;
    console.log('TypeScript definitions generated successfully.');
  });
});