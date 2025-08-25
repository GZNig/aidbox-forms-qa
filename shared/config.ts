import dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseURL: process.env.AIDBOX_BASE_URL,
  apiKey: process.env.AIDBOX_API_KEY,
  portalURL: process.env.AIDBOX_PORTAL_URL,
  qaseApiKey: process.env.QASE_API_KEY,
};
