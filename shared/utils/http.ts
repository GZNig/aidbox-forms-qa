/**
 * Минималистичный HTTP-хелпер для серверных JSON-запросов.
 *
 * Зачем:
 * - Используем для работы с Aidbox (PUT /Client, PUT /AccessPolicy) под админской Cookie-сессией.
 * - SDK (@aidbox/sdk-r4) не работает с Cookie-авторизацией, а RPC портала не создаёт ресурсы в Aidbox.
 *
 * Что делает:
 * - Отправляет JSON-запросы через Node.js http/https, без fetch.
 * - Добавляет заголовки Content-Type/Accept, поддерживает Cookie и x-csrf-token.
 * - Бросает ошибку при ответах не 2xx с текстом ответа.
 *
 */
import http from 'http';
import https from 'https';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Опции JSON-запроса
 * - method: HTTP-метод
 * - baseUrl: базовый URL (например, http://localhost:8080)
 * - path: путь (например, /Client/test)
 * - body: произвольный JSON, сериализуется автоматически
 * - cookieHeader: строка Cookie для сессионной авторизации (например, из логина админа)
 * - xsrfToken: значение для заголовка x-csrf-token (если требуется)
 */
export interface JsonRequestOptions<TBody> {
  method: HttpMethod;
  baseUrl: string;
  path: string;
  body?: TBody;
  cookieHeader?: string;
  xsrfToken?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

/**
 * Выполнить HTTP-запрос и вернуть JSON-ответ (если он был).
 * При статусах не 2xx выбрасывает Error с текстом ответа.
 */
export async function requestJson<TResponse, TBody = unknown>(
  options: JsonRequestOptions<TBody>
): Promise<TResponse> {
  const url = new URL(options.path, options.baseUrl);
  const isHttps = url.protocol === 'https:';
  const transport = isHttps ? https : http;
  const timeoutMs = options.timeoutMs ?? 15000;

  const bodyString = options.body !== undefined ? JSON.stringify(options.body) : undefined;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (options.headers) {
    Object.assign(headers, options.headers);
  }
  if (bodyString) {
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = Buffer.byteLength(bodyString).toString();
  }
  if (options.cookieHeader) {
    headers['Cookie'] = options.cookieHeader;
  }
  if (options.xsrfToken) {
    headers['x-csrf-token'] = options.xsrfToken;
  }

  return new Promise<TResponse>((resolve, reject) => {
    const req = transport.request(
      {
        hostname: url.hostname,
        port: url.port ? Number(url.port) : isHttps ? 443 : 80,
        path: url.pathname + url.search,
        method: options.method,
        headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf-8');
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const json = text
                ? (JSON.parse(text) as TResponse)
                : (undefined as unknown as TResponse);
              resolve(json);
            } catch (e) {
              // No JSON body
              resolve(undefined as unknown as TResponse);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${text}`));
          }
        });
      }
    );
    req.on('error', (err) => reject(err));
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Request timeout after ${timeoutMs}ms`));
    });
    if (bodyString) {
      req.write(bodyString);
    }
    req.end();
  });
}
