import { Path, match } from 'node-match-path';
/**
 * Returns the result of matching given request URL against a mask.
 */
export declare function matchRequestUrl(url: URL, path: Path, baseUrl?: string): ReturnType<typeof match>;
