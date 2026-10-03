/**
 * Minimal TSX syntax highlighter.
 *
 * ~120 lines instead of pulling a 40 kB highlighting dependency into a docs
 * site. Ordered alternation means the first matching rule wins, which is
 * enough for the curated snippets this site renders.
 */

export type TokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'template'
  | 'keyword'
  | 'boolean'
  | 'number'
  | 'tag'
  | 'attr'
  | 'fn'
  | 'punct'
  | 'const';

export interface Token {
  kind: TokenKind;
  value: string;
}

const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var', 'function',
  'return', 'if', 'else', 'for', 'while', 'new', 'class', 'extends', 'interface',
  'type', 'as', 'async', 'await', 'try', 'catch', 'finally', 'typeof', 'instanceof',
  'in', 'of', 'this', 'void', 'null', 'undefined', 'delete', 'switch', 'case',
  'break', 'continue', 'do', 'yield', 'implements', 'readonly', 'keyof',
]);

const LITERALS = new Set(['true', 'false', 'null', 'undefined']);

const RULES: { kind: TokenKind; pattern: RegExp }[] = [
  { kind: 'comment', pattern: /^\/\/[^\n]*/ },
  { kind: 'comment', pattern: /^\/\*[\s\S]*?\*\// },
  { kind: 'template', pattern: /^`(?:\\.|[^`\\])*`/ },
  { kind: 'string', pattern: /^'(?:\\.|[^'\\])*'/ },
  { kind: 'string', pattern: /^"(?:\\.|[^"\\])*"/ },
  { kind: 'tag', pattern: /^<\/?[A-Z][A-Za-z0-9_.]*/ },
  { kind: 'tag', pattern: /^<\/?[a-z][a-z0-9-]*(?=[\s/>])/ },
  { kind: 'attr', pattern: /^[A-Za-z_$][\w$-]*(?==)/ },
  { kind: 'attr', pattern: /^[A-Za-z_$][\w$-]*(?=\s*=\s*\{)/ },
  { kind: 'boolean', pattern: new RegExp(`^\\b(?:${[...LITERALS].join('|')})\\b`) },
  { kind: 'keyword', pattern: new RegExp(`^\\b(?:${[...KEYWORDS].join('|')})\\b`) },
  { kind: 'const', pattern: /^\b[A-Z][A-Z0-9_]{2,}\b/ },
  { kind: 'fn', pattern: /^[A-Za-z_$][\w$]*(?=\()/ },
  { kind: 'number', pattern: /^\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/ },
  { kind: 'punct', pattern: /^[{}()[\].,;:?!<>+\-*/%=&|~^]+/ },
  { kind: 'plain', pattern: /^\s+/ },
  { kind: 'plain', pattern: /^[A-Za-z_$][\w$]*/ },
  { kind: 'plain', pattern: /^[^]/ },
];

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let rest = source;
  let guard = 0;

  while (rest.length > 0 && guard < 200_000) {
    guard += 1;
    let matched = false;

    for (const rule of RULES) {
      const match = rule.pattern.exec(rest);
      if (match && match[0].length > 0) {
        tokens.push({ kind: rule.kind, value: match[0] });
        rest = rest.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ kind: 'plain', value: rest[0]! });
      rest = rest.slice(1);
    }
  }

  return coalesce(tokens);
}

function coalesce(tokens: Token[]): Token[] {
  const output: Token[] = [];
  for (const token of tokens) {
    const last = output[output.length - 1];
    if (last && last.kind === token.kind) last.value += token.value;
    else output.push({ ...token });
  }
  return output;
}

export const TOKEN_COLORS: Record<TokenKind, string> = {
  plain: 'var(--code-fg)',
  comment: 'var(--code-comment)',
  string: 'var(--code-string)',
  template: 'var(--code-string)',
  keyword: 'var(--code-keyword)',
  boolean: 'var(--code-number)',
  number: 'var(--code-number)',
  tag: 'var(--code-tag)',
  attr: 'var(--code-attr)',
  fn: 'var(--code-fn)',
  punct: 'var(--code-punct)',
  const: 'var(--code-const)',
};
