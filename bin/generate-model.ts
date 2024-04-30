import { writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv as { model?: string | undefined, attributes?: string | undefined };

const modelName = argv.model as string;
const modelPath = resolve(__dirname, `../db/models/${modelName}.ts`);

if (existsSync(modelPath)) {
  console.error(`\x1b[31m********************************************************\x1b[0m`);
  console.error(`\x1b[31mError: A model already exists with the name ${modelName}\x1b[0m`);
  console.error(`\x1b[31m********************************************************\x1b[0m`);
  process.exit(1);
}

const attributes = (argv.attributes as string).split(' ').map(s => s.split(':'));

const getType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'string':
      return 'String';
    case 'number':
      return 'Number';
    case 'date':
      return 'Date';
    case 'boolean':
      return 'Boolean';
    default:
      return 'any';
  }
};

const modelInterface = `export interface I${modelName} {\n${attributes.map(([name, type]) => `  ${name}: ${getType(type)};`).join('\n')}\n}\n\n`;
const modelSchema = `const ${modelName}Schema = new mongoose.Schema<I${modelName}Document>({${attributes.map(([name, type]) => `\n  ${name}: ${getType(type)},`).join('')}\n});\n\n`;
const modelClass = `const ${modelName}: Model<I${modelName}Document> = mongoose.model('${modelName}', ${modelName}Schema);\n\nexport default ${modelName};\n`;

const content = `import mongoose, { Document, Model } from 'mongoose';\n\n${modelInterface}interface I${modelName}Document extends I${modelName}, Document {}\n\n${modelSchema}${modelClass}`;

writeFileSync(modelPath, content);

console.error(`\x1b[32m********************************************************\x1b[0m`);
console.error(`\x1b[32mSuccess: ${modelName} model generated\x1b[0m`);
console.error(`\x1b[32m********************************************************\x1b[0m`);
console.error(`\x1b[32mDo not forget to import it like following where you are willing to use it\x1b[0m`);
console.error(`\x1b[32mimport ${modelName}, { I${modelName} } from '../db/models/${modelName}';\x1b[0m`);