const fs = require('node:fs');
const path = require('node:path');

const ENV_FILE = path.resolve(__dirname, '.env.local');

function readRestUrl() {
  if (process.env.ZETARIS_REST_URL) {
    return process.env.ZETARIS_REST_URL;
  }

  try {
    const text = fs.readFileSync(ENV_FILE, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const match = /^\s*ZETARIS_REST_URL\s*=\s*(.*?)\s*$/.exec(line);
      if (match) {
        return match[1].replace(/^['"]|['"]$/g, '');
      }
    }
  } catch {}

  return 'http://localhost:8888/api/v1.0';
}

const restUrl = new URL(readRestUrl());
const basePath = restUrl.pathname.replace(/\/+$/, '');

module.exports = {
  '/zetaris-api': {
    target: restUrl.origin,
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/zetaris-api': basePath },
    logLevel: 'warn',
  },
};
