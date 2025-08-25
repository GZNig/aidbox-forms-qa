// utils/aidbox-test-client.ts
import { requestJson } from '@utils/http';
import { AidboxInstance, ClientCredentials } from '@fixtures/index';

export async function createTestClientWithPolicy(
  aidboxInstance: AidboxInstance,
  cookieHeader: string
): Promise<ClientCredentials> {
  const id = `test-client-${Date.now()}`;
  const secret = Math.random().toString(36).slice(2);

  await requestJson({
    method: 'PUT',
    baseUrl: aidboxInstance.url,
    path: `/Client/${id}`,
    body: { id, secret, grant_types: ['basic', 'password'] },
    cookieHeader,
  });

  await requestJson({
    method: 'PUT',
    baseUrl: aidboxInstance.url,
    path: `/AccessPolicy/${id}-allow`,
    body: {
      id: `${id}-allow`,
      engine: 'allow',
      link: [{ resourceType: 'Client', id }],
      description: 'E2E: allow all for temporary test client',
    },
    cookieHeader,
  });

  return { id, secret };
}