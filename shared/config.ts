import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  baseURL: requireEnv('AIDBOX_BASE_URL'),
  apiKey: requireEnv('AIDBOX_API_KEY'),
  portalURL: requireEnv('AIDBOX_PORTAL_URL'),
};

export const qaseConfig = {
  apiKey: requireEnv('QASE_API_KEY'),
  projectCode: requireEnv('QASE_PROJECT_CODE'),
  basePath: requireEnv('QASE_BASE_URL'),
  environmentId: requireEnv('QASE_ENVIRONMENT_ID'),
};
