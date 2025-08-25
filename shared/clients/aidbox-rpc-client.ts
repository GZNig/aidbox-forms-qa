import { config } from '@config';

const rpcURL = `${config.portalURL}/rpc`;

async function rpcCall<T>(method: string, params: Record<string, unknown>): Promise<T> {
  const response = await fetch(rpcURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ method, params }),
  });

  if (!response.ok) {
    throw new Error(`RPC call failed (${method}): ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as T;
}

interface LicenseResponse {
  result: {
    jwt: string;
    license: {
      id: string;
      'runme-admin-password': string;
    };
  };
}

export async function createLicense() {
  const data = await rpcCall<LicenseResponse>('portal.portal/issue-license', {
    token: config.apiKey,
    name: `test-license-${Date.now()}`,
    product: 'aidbox',
    type: 'development',
  });

  return {
    success: true,
    license: {
      jwt: data.result.jwt,
      id: data.result.license.id,
      adminPassword: data.result.license['runme-admin-password'],
    },
  };
}

export async function deleteLicense(id: string) {
  await rpcCall<Record<string, never>>('portal.portal/remove-license', {
    token: config.apiKey,
    id,
  });
  return true;
}
