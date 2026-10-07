import React, { useMemo, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type DiffViewMode = 'unified' | 'split';

export interface DiffViewerProps extends HTMLAttributes<HTMLDivElement> {
  /** Original base string or code. */
  oldValue: string;
  /** New/modified string or code. */
  newValue: string;
  /** Layout presentation style: 'unified' (single column) or 'split' (side-by-side). Defaults to 'unified'. */
  mode?: DiffViewMode;
  /** Optional title or branch label for old version. */
  oldTitle?: string;
  /** Optional title or branch label for new version. */
  newTitle?: string;
  /** Whether to hide line numbers in the gutter. Defaults to false. */
  hideLineNumbers?: boolean;
}

type DiffType = 'add' | 'delete' | 'normal';

interface DiffLine {
  type: DiffType;
  oldNum?: number;
  newNum?: number;
  content: string;
}

interface SplitRow {
  oldLine?: { num: number; content: string; type: DiffType };
  newLine?: { num: number; content: string; type: DiffType };
}

/**
 * Computes a standard line-by-line diff using Longest Common Subsequence (LCS).
 * Zero runtime dependencies.
 */
function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const m = oldLines.length;
  const n = newLines.length;

  // Build DP table for LCS
  const dp: number[][] = [];
  for (let idx = 0; idx <= m; idx++) {
    dp[idx] = new Array(n + 1).fill(0);
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (oldLines[i] === newLines[j]) {
        dp[i + 1]![j + 1] = (dp[i]![j] ?? 0) + 1;
      } else {
        dp[i + 1]![j + 1] = Math.max(dp[i + 1]![j] ?? 0, dp[i]![j + 1] ?? 0);
      }
    }
  }

  // Backtrack to find diff
  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  const stack: DiffLine[] = [];
  let oldNum = m;
  let newNum = n;

  while (i > 0 || j > 0) {
    const oLine = oldLines[i - 1] ?? '';
    const nLine = newLines[j - 1] ?? '';
    const dpLeft = j > 0 && dp[i] ? (dp[i]![j - 1] ?? 0) : 0;
    const dpUp = i > 0 && dp[i - 1] ? (dp[i - 1]![j] ?? 0) : 0;

    if (i > 0 && j > 0 && oLine === nLine) {
      stack.push({
        type: 'normal',
        oldNum: oldNum--,
        newNum: newNum--,
        content: oLine,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dpLeft >= dpUp)) {
      stack.push({
        type: 'add',
        newNum: newNum--,
        content: nLine,
      });
      j--;
    } else if (i > 0) {
      stack.push({
        type: 'delete',
        oldNum: oldNum--,
        content: oLine,
      });
      i--;
    }
  }

  while (stack.length > 0) {
    result.push(stack.pop()!);
  }

  return result;
}

/**
 * Transforms unified diff lines into aligned side-by-side rows.
 */
function toSplitRows(diffLines: DiffLine[]): SplitRow[] {
  const rows: SplitRow[] = [];
  let i = 0;

  while (i < diffLines.length) {
    const cur = diffLines[i];
    if (!cur) break;

    if (cur.type === 'normal') {
      rows.push({
        oldLine: { num: cur.oldNum ?? 0, content: cur.content, type: 'normal' },
        newLine: { num: cur.newNum ?? 0, content: cur.content, type: 'normal' },
      });
      i++;
    } else {
      // Gather consecutive deletes and adds
      const deletes: DiffLine[] = [];
      const adds: DiffLine[] = [];

      while (i < diffLines.length && diffLines[i]?.type === 'delete') {
        const d = diffLines[i];
        if (d) deletes.push(d);
        i++;
      }
      while (i < diffLines.length && diffLines[i]?.type === 'add') {
        const a = diffLines[i];
        if (a) adds.push(a);
        i++;
      }

      const maxLen = Math.max(deletes.length, adds.length);
      for (let k = 0; k < maxLen; k++) {
        const del = deletes[k];
        const add = adds[k];
        rows.push({
          oldLine: del ? { num: del.oldNum ?? 0, content: del.content, type: 'delete' } : undefined,
          newLine: add ? { num: add.newNum ?? 0, content: add.content, type: 'add' } : undefined,
        });
      }
    }
  }

  return rows;
}

export function DiffViewer({
  oldValue,
  newValue,
  mode = 'unified',
  oldTitle = 'Original',
  newTitle = 'Modified',
  hideLineNumbers = false,
  className,
  style,
  ...rest
}: DiffViewerProps) {
  const diffLines = useMemo(() => computeDiff(oldValue, newValue), [oldValue, newValue]);
  const splitRows = useMemo(() => (mode === 'split' ? toSplitRows(diffLines) : []), [diffLines, mode]);

  const stats = useMemo(() => {
    let additions = 0;
    let deletions = 0;
    for (const line of diffLines) {
      if (line.type === 'add') additions++;
      else if (line.type === 'delete') deletions++;
    }
    return { additions, deletions };
  }, [diffLines]);

  return (
    <div
      className={cn('pui-diff-viewer', className)}
      style={{
        border: '1px solid var(--pui-border, #e2e8f0)',
        borderRadius: 'var(--pui-radius-lg, 8px)',
        overflow: 'hidden',
        background: 'var(--pui-surface, #ffffff)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '0.8125rem',
        lineHeight: 1.5,
        ...style,
      }}
      {...rest}
    >
      {/* Diff Bar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.875rem',
          background: 'var(--pui-surface-subtle, #f8fafc)',
          borderBottom: '1px solid var(--pui-border, #e2e8f0)',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--pui-fg-muted, #64748b)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>{mode === 'split' ? `${oldTitle} ↔ ${newTitle}` : 'Diff View'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--pui-success, #10b981)', fontWeight: 700 }}>
            +{stats.additions}
          </span>
          <span style={{ color: 'var(--pui-danger, #ef4444)', fontWeight: 700 }}>
            -{stats.deletions}
          </span>
        </div>
      </div>

      {/* Unified Diff Mode */}
      {mode === 'unified' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <tbody>
              {diffLines.map((line, idx) => {
                const isAdd = line.type === 'add';
                const isDel = line.type === 'delete';

                const bg = isAdd
                  ? 'rgba(16, 185, 129, 0.12)'
                  : isDel
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'transparent';

                const color = isAdd
                  ? 'var(--pui-success, #059669)'
                  : isDel
                  ? 'var(--pui-danger, #dc2626)'
                  : 'inherit';

                const prefix = isAdd ? '+' : isDel ? '-' : ' ';

                return (
                  <tr key={idx} style={{ background: bg }}>
                    {!hideLineNumbers && (
                      <>
                        <td
                          style={{
                            width: '2.5rem',
                            textAlign: 'right',
                            padding: '0 0.5rem',
                            color: 'var(--pui-fg-subtle, #94a3b8)',
                            userSelect: 'none',
                            borderRight: '1px solid var(--pui-border, #f1f5f9)',
                          }}
                        >
                          {line.oldNum || ''}
                        </td>
                        <td
                          style={{
                            width: '2.5rem',
                            textAlign: 'right',
                            padding: '0 0.5rem',
                            color: 'var(--pui-fg-subtle, #94a3b8)',
                            userSelect: 'none',
                            borderRight: '1px solid var(--pui-border, #f1f5f9)',
                          }}
                        >
                          {line.newNum || ''}
                        </td>
                      </>
                    )}
                    <td
                      style={{
                        width: '1.25rem',
                        textAlign: 'center',
                        color,
                        fontWeight: 700,
                        userSelect: 'none',
                      }}
                    >
                      {prefix}
                    </td>
                    <td
                      style={{
                        padding: '0 0.75rem',
                        whiteSpace: 'pre',
                        color: isAdd || isDel ? color : 'var(--pui-fg, #1e293b)',
                      }}
                    >
                      {line.content}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Split Side-by-Side Mode */}
      {mode === 'split' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <tbody>
              {splitRows.map((row, idx) => {
                const oldBg =
                  row.oldLine?.type === 'delete' ? 'rgba(239, 68, 68, 0.12)' : 'transparent';
                const newBg =
                  row.newLine?.type === 'add' ? 'rgba(16, 185, 129, 0.12)' : 'transparent';

                return (
                  <tr key={idx}>
                    {/* Left side (Old) */}
                    {!hideLineNumbers && (
                      <td
                        style={{
                          width: '2.5rem',
                          textAlign: 'right',
                          padding: '0 0.5rem',
                          color: 'var(--pui-fg-subtle, #94a3b8)',
                          userSelect: 'none',
                          borderRight: '1px solid var(--pui-border, #f1f5f9)',
                          background: oldBg,
                        }}
                      >
                        {row.oldLine?.num || ''}
                      </td>
                    )}
                    <td
                      style={{
                        width: 'calc(50% - 2.5rem)',
                        padding: '0 0.625rem',
                        whiteSpace: 'pre',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        background: oldBg,
                        color:
                          row.oldLine?.type === 'delete'
                            ? 'var(--pui-danger, #dc2626)'
                            : 'var(--pui-fg, #1e293b)',
                        borderRight: '2px solid var(--pui-border, #e2e8f0)',
                      }}
                    >
                      {row.oldLine ? (row.oldLine.type === 'delete' ? '- ' : '  ') + row.oldLine.content : ''}
                    </td>

                    {/* Right side (New) */}
                    {!hideLineNumbers && (
                      <td
                        style={{
                          width: '2.5rem',
                          textAlign: 'right',
                          padding: '0 0.5rem',
                          color: 'var(--pui-fg-subtle, #94a3b8)',
                          userSelect: 'none',
                          borderRight: '1px solid var(--pui-border, #f1f5f9)',
                          background: newBg,
                        }}
                      >
                        {row.newLine?.num || ''}
                      </td>
                    )}
                    <td
                      style={{
                        width: 'calc(50% - 2.5rem)',
                        padding: '0 0.625rem',
                        whiteSpace: 'pre',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        background: newBg,
                        color:
                          row.newLine?.type === 'add'
                            ? 'var(--pui-success, #059669)'
                            : 'var(--pui-fg, #1e293b)',
                      }}
                    >
                      {row.newLine ? (row.newLine.type === 'add' ? '+ ' : '  ') + row.newLine.content : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
