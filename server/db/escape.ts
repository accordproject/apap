const CHARS_GLOBAL_BACKSLASH_SUPPORTED_RX = /[\0\b\t\n\r\x1a"'\\]/g;
const CHARS_ESCAPE_BACKSLASH_SUPPORTED_MAP: Record<string, string> = {
  "\0": "\\0",
  "\b": "\\b",
  "\t": "\\t",
  "\n": "\\n",
  "\r": "\\r",
  "\x1a": "\\Z",
  '"': '\\"',
  "'": "\\'",
  "\\": "\\\\",
};

export interface Options {
  backslashSupported?: boolean;
}

/**
 * Escapes the given string to protect against SQL injection attacks.
 *
 * By default, it assumes that backslashes are not supported as they are not part of the standard SQL spec.
 * Quoting from the [SQLite web site](https://sqlite.org/lang_expr.html):
 *
 * > C-style escapes using the backslash character are not supported because they are not standard SQL.
 *
 * This means three things:
 *
 * - backslashes and double quotes `"` are not escaped by default
 * - single quotes are escaped via `''` instead of `\'`
 * - your sql engine should throw an error when encountering a backslash escape
 *   as part of a string, unless it is a literal backslash, i.e. `'backslash: \\'`.
 *
 * It is recommended to set the `backslashSupported` option `true` if your SQL
 * engine supports it. In that case backslash sequences are escaped and single
 * and double quotes are escaped via a backslash, i.e. `'\''`.
 *
 * @param {String} value the original string to be used in a SQL query
 * @param {Object} options
 * @param {Boolean} [options.backslashSupported = false] if `true` backslashes are supported
 * @returns {String} the original string escaped wrapped in single quotes, i.e. `'mystring'`
 */
export default function escapeString(value: string, options: Options = {}) {
  if (value == null) {
    throw new Error("Need to pass a valid string");
  }

  const backslashSupported = !!options.backslashSupported;

  if (!backslashSupported) {
    return wrap(value.replace(/'/g, "''"));
  }

  const charsRx = CHARS_GLOBAL_BACKSLASH_SUPPORTED_RX;
  const charsEscapeMap = CHARS_ESCAPE_BACKSLASH_SUPPORTED_MAP;

  let chunkIndex = (charsRx.lastIndex = 0);
  let escapedValue = "";
  let match;

  while ((match = charsRx.exec(value))) {
    const t = match[0];

    escapedValue += value.slice(chunkIndex, match.index) + charsEscapeMap[t];
    chunkIndex = charsRx.lastIndex;
  }

  // Nothing was escaped
  if (chunkIndex === 0) {
    return wrap(value);
  }

  if (chunkIndex < value.length) {
    return wrap(escapedValue + value.slice(chunkIndex));
  }

  return wrap(escapedValue);
}

function wrap(value: string) {
  return `'${value}'`;
}