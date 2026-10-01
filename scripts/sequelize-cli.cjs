const { spawnSync } = require('child_process');

const result = spawnSync(
  'node',
  [
    '--import',
    'tsx/esm',
    './node_modules/sequelize-cli/lib/sequelize',
    ...process.argv.slice(2),
  ],
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);