import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const swaggerPath = path.join(process.cwd(), 'src/docs/swagger.yaml');

const swaggerSpec = parse(fs.readFileSync(swaggerPath, 'utf8'));

export default swaggerSpec;
