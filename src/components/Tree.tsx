import React, {
  forwardRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
  type HTMLAttributes,
} from 'react';
import { cn } from '../utils/cn';
import { ChevronRightIcon, FolderIcon, FolderOpenIcon, FileIcon } from './icons';

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Root hierarchical tree nodes. */
  data: readonly TreeNode[];
  /** Controlled array of expanded node IDs. */
  expandedIds?: string[];
  /** Default array of expanded node IDs. */
  defaultExpandedIds?: string[];
  /** Callback fired when a node is expanded or collapsed. */
  onToggle?: (nodeId: string, expanded: boolean) => void;
  /** Controlled ID of currently selected node. */
  selectedId?: string;
  /** Callback fired when a node is selected. */
  onSelect?: (nodeId: string, node: TreeNode) => void;
  /** Accessible label. @default 'File Tree' */
  'aria-label'?: string;
}

/**
 * Tree displays hierarchical folder and file directories with keyboard navigation.
 * Highly accessible, with indent guidelines and responsive mobile scaling.
 */
export const Tree = forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      expandedIds: controlledExpandedIds,
      defaultExpandedIds = [],
      onToggle,
      selectedId,
      onSelect,
      'aria-label': ariaLabel = 'File Tree',
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledExpandedIds !== undefined;
    const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpandedIds);
    const expandedList = isControlled ? controlledExpandedIds : internalExpanded;

    const isExpanded = (id: string) => expandedList.includes(id);

    const toggleNode = (id: string) => {
      const willExpand = !isExpanded(id);
      if (!isControlled) {
        setInternalExpanded((prev) =>
          willExpand ? [...prev, id] : prev.filter((i) => i !== id)
        );
      }
      onToggle?.(id, willExpand);
    };

    const renderNode = (node: TreeNode, depth = 0) => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      const expanded = isExpanded(node.id);
      const isSelected = selectedId === node.id;

      const defaultIcon = hasChildren ? (
        expanded ? <FolderOpenIcon size={16} /> : <FolderIcon size={16} />
      ) : (
        <FileIcon size={16} />
      );

      const handleRowClick = () => {
        if (node.disabled) return;
        if (hasChildren) {
          toggleNode(node.id);
        }
        onSelect?.(node.id, node);
      };

      const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (node.disabled) return;

        if (e.key === 'ArrowRight' && hasChildren && !expanded) {
          e.preventDefault();
          toggleNode(node.id);
        } else if (e.key === 'ArrowLeft' && hasChildren && expanded) {
          e.preventDefault();
          toggleNode(node.id);
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick();
        }
      };

      return (
        <div key={node.id} className="pui-tree__node" role="treeitem" aria-expanded={hasChildren ? expanded : undefined}>
          <div
            tabIndex={node.disabled ? -1 : 0}
            role="button"
            aria-selected={isSelected}
            className={cn(
              'pui-tree__row',
              isSelected && 'pui-tree__row--selected',
              node.disabled && 'pui-tree__row--disabled'
            )}
            style={{ paddingLeft: `calc(var(--pui-tree-indent, 1.125rem) * ${depth} + 0.5rem)` }}
            onClick={handleRowClick}
            onKeyDown={handleKeyDown}
          >
            {hasChildren ? (
              <span
                className={cn('pui-tree__chevron', expanded && 'pui-tree__chevron--expanded')}
                aria-hidden="true"
              >
                <ChevronRightIcon size={14} />
              </span>
            ) : (
              <span className="pui-tree__spacer" aria-hidden="true" />
            )}

            <span className="pui-tree__icon" aria-hidden="true">
              {node.icon || defaultIcon}
            </span>

            <span className="pui-tree__label">{node.label}</span>
          </div>

          {hasChildren && expanded && (
            <div className="pui-tree__branch" role="group">
              {node.children!.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        role="tree"
        aria-label={ariaLabel}
        className={cn('pui-tree', className)}
        {...props}
      >
        {data.map((rootNode) => renderNode(rootNode, 0))}
      </div>
    );
  }
);

Tree.displayName = 'Tree';
