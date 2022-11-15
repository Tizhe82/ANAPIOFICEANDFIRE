/**
 * Parses a given string into a JSON.
 * Does not throw an exception on an invalid JSON string.
 */
export declare function jsonParse<T extends Record<string, any>>(str: string): T | undefined;
