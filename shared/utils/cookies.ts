import { request } from 'http';

export async function getAuthCookies(
  baseUrl: string,
  csrf: string,
  adminPassword: string,
  cookieLogin: string
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const url = new URL('/auth/login', baseUrl);

    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieLogin,
      },
    };

    const req = request(options, (res) => {
      const setCookieHeaders = res.headers['set-cookie'];

      const cookies = setCookieHeaders
        ? Array.isArray(setCookieHeaders)
          ? setCookieHeaders
          : [setCookieHeaders]
        : [];

      if (cookies.length === 0) {
        reject(new Error(`Auth failed: status ${res.statusCode}, no cookies in response`));
      }

      resolve(cookies);
    });

    req.on('error', (error) => reject(error));
    req.write(`_csrf=${csrf}&username=admin&password=${adminPassword}`);
    req.end();
  });
}

export function parseSetCookie(raw: string, baseURL: string) {
  const [nameValue, ...attrs] = raw.split(';');
  const [name, value] = nameValue.split('=');
  return {
    name: name.trim(),
    value: value?.trim() || '',
    domain: new URL(baseURL).hostname,
    path: '/',
    secure: attrs.some((a) => /secure/i.test(a)),
    httpOnly: attrs.some((a) => /httponly/i.test(a)),
  };
}