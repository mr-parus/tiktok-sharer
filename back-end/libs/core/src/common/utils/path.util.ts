import { ValidationException } from '@libs/core/common/exceptions/validation.exception';
import { resolve } from 'path';

export const PROJECT_ROOT_DIR = process.cwd(); // TODO: process.cwd is not reliable
export const PUBLIC_DIR_PATH = resolve(PROJECT_ROOT_DIR, 'public');
export const ASSETS_DIR_PATH = resolve(PROJECT_ROOT_DIR, 'assets');

const secureResolve = (root: string, path: string): string => {
  const finalPath = resolve(root, path);

  if (finalPath.indexOf(root) !== 0 || finalPath.indexOf('\0') !== -1) {
    throw new ValidationException({
      reason: 'Unexpected path traversal',
      received: {
        root,
        path,
      },
    });
  }

  return finalPath;
};

export function resolveInPublicDir(path: string): string {
  return secureResolve(PUBLIC_DIR_PATH, path);
}

export function resolveInAssetsDir(path: string): string {
  return secureResolve(ASSETS_DIR_PATH, path);
}
