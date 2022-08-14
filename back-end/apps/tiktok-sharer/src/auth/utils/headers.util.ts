export function getJwtTokenFromAuthHeader(
  authHeader: unknown,
): string | undefined {
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7, authHeader.length);
  } else {
    return undefined;
  }
}
