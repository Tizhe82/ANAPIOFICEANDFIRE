'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Converts a string path to a Regular Expression.
 * Transforms path parameters into named RegExp groups.
 */
const pathToRegExp = (path) => {
    const pattern = path
        // Escape literal dots
        .replace(/\./g, '\\.')
        // Escape literal slashes
        .replace(/\//g, '/')
        // Escape literal question marks
        .replace(/\?/g, '\\?')
        // Ignore trailing slashes
        .replace(/\/+$/, '')
        // Replace wildcard with any zero-to-any character sequence
        .replace(/\*+/g, '.*')
        // Replace parameters with named capturing groups
        .replace(/:([^\d|^\/][a-zA-Z0-9_]*(?=(?:\/|\\.)|$))/g, (_, paramName) => `(?<${paramName}>[^\/]+?)`)
        // Allow optional trailing slash
        .concat('(\\/|$)');
    return new RegExp(pattern, 'gi');
};

/**
 * Matches a given url against a path.
 */
const match = (path, url) => {
    const expression = path instanceof RegExp ? path : pathToRegExp(path);
    const match = expression.exec(url) || false;
    // Matches in strict mode: match string should equal to input (url)
    // Otherwise loose matches will be considered truthy:
    // match('/messages/:id', '/messages/123/users') // true
    const matches = path instanceof RegExp ? !!match : !!match && match[0] === match.input;
    return {
        matches,
        params: match && matches ? match.groups || null : null,
    };
};

exports.match = match;
exports.pathToRegExp = pathToRegExp;
//# sourceMappingURL=cjs.js.map
