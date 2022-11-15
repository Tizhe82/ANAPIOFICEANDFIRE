import { Path } from 'node-match-path';
/**
 * Normalizes a given request handler path:
 * - Preserves RegExp.
 * - Removes query parameters and hashes.
 * - Rebases relative URLs against the "baseUrl" or the current location.
 * - Preserves relative URLs in Node.js, unless specified otherwise.
 */
export declare function normalizePath(path: Path, baseUrl?: string): Path;
