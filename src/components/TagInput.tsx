import React, {
  forwardRef,
  useRef,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
  type FocusEvent,
  type HTMLAttributes,
} from 'react';
import { cn } from '../utils/cn';
import { XIcon } from './icons';

export interface TagInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of tag strings (controlled). */
  value?: string[];
  /** Default array of tags (uncontrolled). */
  defaultValue?: string[];
  /** Callback fired whenever tags change. */
  onChange?: (tags: string[]) => void;
  /** Maximum number of tags allowed. */
  maxTags?: number;
  /** Whether to allow duplicate tag names. @default false */
  allowDuplicates?: boolean;
  /** Whether to add the current text as a tag when input loses focus. @default false */
  addOnBlur?: boolean;
  /** Placeholder for the text input. @default 'Add tag...' */
  placeholder?: string;
  /** Whether the tag input is disabled. @default false */
  disabled?: boolean;
  /** Delimiters that trigger tag creation. @default ['Enter', ','] */
  delimiters?: string[];
}

/**
 * TagInput renders an interactive chip-based input for tagging and categorization.
 * Supports keyboard creation, backspace removal, copy-paste separation, and responsive wrapping.
 */
export const TagInput = forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = [],
      onChange,
      maxTags,
      allowDuplicates = false,
      addOnBlur = false,
      placeholder = 'Add tag...',
      disabled = false,
      delimiters = ['Enter', ','],
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalTags, setInternalTags] = useState<string[]>(defaultValue);
    const tags = isControlled ? controlledValue : internalTags;

    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const updateTags = (newTags: string[]) => {
      if (!isControlled) {
        setInternalTags(newTags);
      }
      onChange?.(newTags);
    };

    const addTag = (text: string) => {
      const clean = text.trim();
      if (!clean) return;

      if (!allowDuplicates && tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
        setInputValue('');
        return;
      }

      if (maxTags && tags.length >= maxTags) {
        return;
      }

      updateTags([...tags, clean]);
      setInputValue('');
    };

    const removeTag = (index: number) => {
      if (disabled) return;
      updateTags(tags.filter((_, i) => i !== index));
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (delimiters.includes(e.key)) {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
        e.preventDefault();
        removeTag(tags.length - 1);
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (delimiters.includes(',') && val.includes(',')) {
        const parts = val.split(',');
        parts.forEach((p) => addTag(p));
      } else {
        setInputValue(val);
      }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (addOnBlur && inputValue) {
        addTag(inputValue);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'pui-tag-input',
          isFocused && 'pui-tag-input--focused',
          disabled && 'pui-tag-input--disabled',
          className
        )}
        onClick={() => inputRef.current?.focus()}
        {...props}
      >
        <div className="pui-tag-input__list">
          {tags.map((tag, idx) => (
            <span key={`${tag}-${idx}`} className="pui-tag-input__chip">
              <span className="pui-tag-input__chip-text">{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  className="pui-tag-input__chip-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(idx);
                  }}
                  aria-label={`Remove tag ${tag}`}
                >
                  <XIcon size={12} />
                </button>
              )}
            </span>
          ))}

          {(!maxTags || tags.length < maxTags) && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              disabled={disabled}
              placeholder={tags.length === 0 ? placeholder : ''}
              className="pui-tag-input__field"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
            />
          )}
        </div>
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';
