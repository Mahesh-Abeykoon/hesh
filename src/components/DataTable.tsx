import { useId, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Checkbox } from './Choice';
import { Skeleton } from './Badge';
import { Spinner } from './Feedback';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  column: string;
  direction: SortDirection;
}

export interface Column<T> {
  id: string;
  header: ReactNode;
  /** Prefer `accessor` + `cell` so sorting and rendering stay in sync. */
  accessor?: (row: T) => string | number;
  cell?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  numeric?: boolean;
  width?: string | number;
  align?: 'start' | 'center' | 'end';
  /** Hide below the given width (px). Requires the consumer's CSS container. */
  hideBelow?: number;
}

export interface DataTableProps<T> {
  columns: readonly Column<T>[];
  data: readonly T[];
  rowKey: (row: T, index: number) => string;
  sort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  selectable?: boolean;
  selectedKeys?: readonly string[];
  onSelectionChange?: (keys: string[]) => void;
  loading?: boolean;
  /** Number of skeleton rows shown while loading. */
  loadingRows?: number;
  emptyState?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  onRowClick?: (row: T, index: number) => void;
  stickyHeader?: boolean;
  className?: string;
  caption?: string;
}

/**
 * Data table with sorting, selection and loading states.
 *
 * Accessibility
 * - `scope="col"` headers, `aria-sort` on the active sortable column.
 * - Sort controls are real buttons inside the header, so they are reachable by
 *   keyboard and announced with their current state.
 * - Row selection uses checkboxes with an accessible name per row, and the
 *   header checkbox reports `aria-checked="mixed"` for partial selection.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  sort = null,
  onSortChange,
  selectable = false,
  selectedKeys,
  onSelectionChange,
  loading = false,
  loadingRows = 5,
  emptyState,
  toolbar,
  footer,
  onRowClick,
  stickyHeader = true,
  className,
  caption,
}: DataTableProps<T>) {
  const captionId = useId();
  const allKeys = data.map((row, index) => rowKey(row, index));
  const selected = new Set(selectedKeys ?? []);
  const selectedOnPage = allKeys.filter((key) => selected.has(key));
  const allSelected = allKeys.length > 0 && selectedOnPage.length === allKeys.length;
  const someSelected = selectedOnPage.length > 0 && !allSelected;

  const toggleSort = (columnId: string) => {
    if (!onSortChange) return;
    if (sort?.column !== columnId) onSortChange({ column: columnId, direction: 'asc' });
    else if (sort.direction === 'asc') onSortChange({ column: columnId, direction: 'desc' });
    else onSortChange(null);
  };

  const toggleRow = (key: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange(Array.from(next));
  };

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      const next = new Set(selected);
      allKeys.forEach((key) => next.delete(key));
      onSelectionChange(Array.from(next));
    } else {
      const next = new Set(selected);
      allKeys.forEach((key) => next.add(key));
      onSelectionChange(Array.from(next));
    }
  };

  return (
    <div className={cn('pui-table-wrap', className)}>
      {toolbar && <div className="pui-table-toolbar">{toolbar}</div>}

      <table className={cn('pui-table', onRowClick && 'pui-table--hover')}>
        {caption && (
          <caption id={captionId} className="pui-sr-only">
            {caption}
          </caption>
        )}
        <thead style={stickyHeader ? undefined : { position: 'static' }}>
          <tr>
            {selectable && (
              <th style={{ width: '2.75rem', paddingInlineEnd: 0 }}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  aria-label={allSelected ? 'Deselect all rows' : 'Select all rows'}
                />
              </th>
            )}
            {columns.map((column) => {
              const isSorted = sort?.column === column.id;
              return (
                <th
                  key={column.id}
                  scope="col"
                  style={{ width: column.width, textAlign: column.align }}
                  aria-sort={
                    isSorted
                      ? sort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : column.sortable
                        ? 'none'
                        : undefined
                  }
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="pui-table__sort"
                      data-dir={isSorted ? sort.direction : undefined}
                      onClick={() => toggleSort(column.id)}
                    >
                      {column.header}
                      {isSorted && sort.direction === 'desc' ? (
                        <ChevronDownIcon />
                      ) : (
                        <ChevronUpIcon />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: loadingRows }, (_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`}>
                {selectable && (
                  <td>
                    <Skeleton width={16} height={16} />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.id}>
                    <Skeleton width={column.numeric ? '48%' : '78%'} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} style={{ padding: 0, border: 'none' }}>
                {emptyState}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const key = rowKey(row, index);
              const isSelected = selected.has(key);
              return (
                <tr
                  key={key}
                  data-selected={isSelected || undefined}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                  style={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {selectable && (
                    <td onClick={(event) => event.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      style={{ textAlign: column.align }}
                      className={cn(column.numeric && 'pui-table__cell--num')}
                    >
                      {column.cell
                        ? column.cell(row, index)
                        : (column.accessor?.(row) as ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {footer && <div className="pui-table-footer">{footer}</div>}

      {loading && (
        <div className="pui-sr-only" role="status">
          <Spinner label="Loading table data" />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Pagination */

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** How many page buttons to show either side of the current page. */
  siblings?: number;
  className?: string;
}

/**
 * Compact pagination with ellipsis. Always renders first and last page so the
 * extremes are one keystroke away.
 */
export function Pagination({ page, pageCount, onPageChange, siblings = 1, className }: PaginationProps) {
  const pages = buildPageRange(page, pageCount, siblings);

  return (
    <nav className={cn('pui-pagination', className)} aria-label="Pagination">
      <button
        type="button"
        className="pui-page-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`gap-${index}`} className="pui-page-ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className="pui-page-btn"
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className="pui-page-btn"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}

function buildPageRange(page: number, pageCount: number, siblings: number): (number | 'ellipsis')[] {
  const totalSlots = siblings * 2 + 5;
  if (pageCount <= totalSlots) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  const showLeftGap = left > 2;
  const showRightGap = right < pageCount - 1;

  const items: (number | 'ellipsis')[] = [1];
  if (showLeftGap) items.push('ellipsis');
  for (let value = left; value <= right; value += 1) {
    if (value !== 1 && value !== pageCount) items.push(value);
  }
  if (showRightGap) items.push('ellipsis');
  items.push(pageCount);
  return items;
}
