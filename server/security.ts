import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { pool } from './postgres.js';

function rateBucket(scope: string, req: Request): string {
  const raw = `${scope}|${req.ip || 'unknown'}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function persistentRateLimit(scope: string, max: number, windowSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = rateBucket(scope, req);
      const result = await pool.query(
        `
        INSERT INTO security_rate_limits (bucket_key, count, reset_at)
        VALUES ($1, 1, NOW() + ($2 * INTERVAL '1 second'))
        ON CONFLICT (bucket_key)
        DO UPDATE SET
          count = CASE
            WHEN security_rate_limits.reset_at <= NOW() THEN 1
            ELSE security_rate_limits.count + 1
          END,
          reset_at = CASE
            WHEN security_rate_limits.reset_at <= NOW()
              THEN NOW() + ($2 * INTERVAL '1 second')
            ELSE security_rate_limits.reset_at
          END
        RETURNING count, reset_at
        `,
        [key, windowSeconds]
      );

      const row = result.rows[0];
      if (Number(row.count) > max) {
        const retryAfter = Math.max(
          1,
          Math.ceil((new Date(row.reset_at).getTime() - Date.now()) / 1000)
        );
        res.setHeader('Retry-After', String(retryAfter));
        res.status(429).json({
          error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Falha no rate limit persistente:', error);
      // Se o controle de limite falhar, não derruba o site; as demais proteções continuam ativas.
      next();
    }
  };
}

export function requireSameOrigin(req: Request, res: Response, next: NextFunction): void {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }

  const fetchSite = req.get('Sec-Fetch-Site');
  if (fetchSite && !['same-origin', 'none'].includes(fetchSite)) {
    res.status(403).json({ error: 'Origem da requisição não autorizada.' });
    return;
  }

  const origin = req.get('Origin');
  if (origin) {
    const expectedOrigin = `${req.protocol}://${req.get('host')}`;
    try {
      if (new URL(origin).origin !== expectedOrigin) {
        res.status(403).json({ error: 'Origem da requisição não autorizada.' });
        return;
      }
    } catch {
      res.status(403).json({ error: 'Origem da requisição inválida.' });
      return;
    }
  }

  next();
}
