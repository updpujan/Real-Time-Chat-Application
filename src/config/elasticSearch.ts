import { Client } from '@elastic/elasticsearch';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

const caPath = path.resolve(process.env.ELASTICSEARCH_CA_PATH!);

const elasticsearchClient = new Client({
  node: process.env.ELASTICSEARCH_NODE!,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME!,
    password: process.env.ELASTICSEARCH_PASSWORD!,
  },
  tls: {
    ca: fs.readFileSync(caPath),
    rejectUnauthorized: true,
  },
});

export default elasticsearchClient;
