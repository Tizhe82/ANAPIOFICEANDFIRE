export declare type Path = RegExp | string;
export interface Match {
    matches: boolean;
    params: Record<string, string> | null;
}
/**
 * Matches a given url against a path.
 */
export declare const match: (path: Path, url: string) => Match;
