import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from '@config';

const sh = promisify(exec);

export async function startInstance(licenseId: string, baseURL: string) {
  await sh('docker compose down -v || true');
  await sh(`curl -L -o docker-compose.yml ${config.portalURL}/runme/l/${licenseId}`);
  await sh('docker compose up -d');

  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch(`${baseURL}/health`);
      if (r.ok) return;
    } catch {
      console.log('Health check error, retrying...');
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error('Instance did not become healthy in time');
}

export async function stopInstance() {
  await sh('docker compose down -v');
}
