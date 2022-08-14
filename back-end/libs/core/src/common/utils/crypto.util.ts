import { createCipheriv, randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';

const ALGORITHM = 'aes-256-cbc';
const INITIAL_VECTOR_LENGTH = 8;
const CSRF_TOKEN_SALT = randomBytes(32).toString('hex');
const CSRF_TOKEN_DEFAULT_SECRET_LENGTH = 18;
const CSRF_TOKEN_DELIMITER = ':';
const JWT_TOKEN_EXPIRATION_TIMEOUT = '1h';
const EQUAL_END_REGEXP = /=+$/;
const PLUS_GLOBAL_REGEXP = /\+/g;
const SLASH_GLOBAL_REGEXP = /\//g;

const signJwtAsync = promisify(jwt.sign);
const verifyJwtAsync = promisify(jwt.verify);

export function signJwtToken(
  payload: Record<string, unknown>,
  secret: string,
): Promise<string> {
  return signJwtAsync(payload, secret, {
    expiresIn: JWT_TOKEN_EXPIRATION_TIMEOUT,
  });
}

export function verifyJwtToken<TPayload>(
  token: string,
  secret: string,
): Promise<TPayload> {
  return verifyJwtAsync(token, secret);
}

export function generateCsrfSecret(length = CSRF_TOKEN_DEFAULT_SECRET_LENGTH) {
  return randomBytes(length)
    .toString('base64')
    .replace(EQUAL_END_REGEXP, '')
    .replace(PLUS_GLOBAL_REGEXP, '-')
    .replace(SLASH_GLOBAL_REGEXP, '_');
}

export function encryptCsrfToken(secret: string): string {
  const keyBuffer = Buffer.from(CSRF_TOKEN_SALT, 'hex');
  const ivHex = randomBytes(INITIAL_VECTOR_LENGTH).toString('hex');
  const cipher = createCipheriv(ALGORITHM, keyBuffer, ivHex);
  const encryptedTextHex = Buffer.concat([
    cipher.update(secret),
    cipher.final(),
  ]).toString('hex');

  return [encryptedTextHex, ivHex].join(CSRF_TOKEN_DELIMITER);
}
