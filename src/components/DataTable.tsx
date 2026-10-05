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
  /** Hide below the given breakpoint ('mobile' <= 640px, 'tablet' <= 860px, or custom px). */
  hideBelow?: number | 'mobile' | 'tablet';
  /** Additional CSS class for custom column styles. */
  className?: string;
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

  const getHideClass = (column: Column<T>) => {
    if (column.hideBelow === 'mobile' || column.hideBelow === 640) return 'pui-table__hide-mobile';
    if (column.hideBelow === 'tablet' || column.hideBelow === 860) return 'pui-table__hide-tablet';
    return undefined;
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
              const hideClass = getHideClass(column);
              return (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(hideClass, column.className)}
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
                {columns.map((column) => {
                  const hideClass = getHideClass(column);
                  return (
                    <td key={column.id} className={cn(hideClass, column.className)}>
                      <Skeleton width={column.numeric ? '48%' : '78%'} />
                    </td>
                  );
                })}
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
                  {columns.map((column) => {
                    const hideClass = getHideClass(column);
                    return (
                      <td
                        key={column.id}
                        style={{ textAlign: column.align }}
                        className={cn(
                          column.numeric && 'pui-table__cell--num',
                          hideClass,
                          column.className
                        )}
                      >
                        {column.cell
                          ? column.cell(row, index)
                          : (column.accessor?.(row) as ReactNode)}
                      </td>
                    );
                  })}
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
  pageCount?: number;
  total?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  siblings?: number;
  size?: 'sm' | 'md' | 'lg';
  simple?: boolean;
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode);
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

/**
 * Responsive pagination with ellipsis, total summary, size changer, and simple mode.
 */
export function Pagination({
  page,
  pageCount,
  total,
  pageSize = 10,
  onPageChange,
  siblings = 1,
  size = 'md',
  simple = false,
  showTotal = false,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  className,
}: PaginationProps) {
  const effectivePageCount = Math.max(1, pageCount ?? (total ? Math.ceil(total / pageSize) : 1));
  const safePage = Math.min(Math.max(1, page), effectivePageCount);
  const startItem = total ? Math.min((safePage - 1) * pageSize + 1, total) : (safePage - 1) * pageSize + 1;
  const endItem = total ? Math.min(safePage * pageSize, total) : safePage * pageSize;

  const totalContent = showTotal ? (
    typeof showTotal === 'function' ? (
      showTotal(total ?? 0, [startItem, endItem])
    ) : (
      <span className="pui-pagination__total">
        {total ? `Showing ${startItem}–${endItem} of ${total}` : `Page ${safePage} of ${effectivePageCount}`}
      </span>
    )
  ) : null;

  const sizeChanger = showSizeChanger ? (
    <select
      className="pui-pagination__size-changer"
      value={pageSize}
      aria-label="Items per page"
      onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
    >
      {pageSizeOptions.map((opt) => (
        <option key={opt} value={opt}>
          {opt} / page
        </option>
      ))}
    </select>
  ) : null;

  if (simple) {
    return (
      <div className={cn('pui-pagination-container', className)}>
        {totalContent}
        <nav className={cn('pui-pagination', `pui-pagination--${size}`)} aria-label="Pagination">
          <button
            type="button"
            className="pui-page-btn"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
            aria-label="Previous page"
          >
            ‹
          </button>
          <span className="pui-pagination__simple-text">
            {safePage} / {effectivePageCount}
          </span>
          <button
            type="button"
            className="pui-page-btn"
            disabled={safePage >= effectivePageCount}
            onClick={() => onPageChange(safePage + 1)}
            aria-label="Next page"
          >
            ›
          </button>
        </nav>
        {sizeChanger}
      </div>
    );
  }

  const pages = buildPageRange(safePage, effectivePageCount, siblings);

  return (
    <div className={cn('pui-pagination-container', className)}>
      {totalContent}
      <nav className={cn('pui-pagination', `pui-pagination--${size}`)} aria-label="Pagination">
        <button
          type="button"
          className="pui-page-btn"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
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
              aria-current={item === safePage ? 'page' : undefined}
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
          disabled={safePage >= effectivePageCount}
          onClick={() => onPageChange(safePage + 1)}
          aria-label="Next page"
        >
          ›
        </button>
      </nav>
      {sizeChanger}
    </div>
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
