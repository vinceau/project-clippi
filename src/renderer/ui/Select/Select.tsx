import { Select as BaseSelect } from "@base-ui/react";
import { clsx } from "clsx";
import React from "react";
import styles from "./Select.module.css";

export interface SelectOption {
  key?: string;
  value: string;
  text: string;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  fluid?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  search?: boolean;
  scrolling?: boolean;
  floating?: boolean;
  button?: boolean;
  inline?: boolean;
  icon?: React.ReactNode;
  options?: SelectOption[];
  trigger?: React.ReactElement;
  className?: string;
  onChange?: (value: string) => void;
  onAddItem?: (value: string) => void;
  children?: React.ReactNode;
}

export function Select({
  value,
  defaultValue,
  disabled,
  placeholder = "Select...",
  fluid,
  scrolling,
  floating,
  button: buttonProp,
  inline,
  icon: iconNode,
  options,
  trigger,
  className,
  onChange,
  children,
}: SelectProps) {
  const handleValueChange = (newValue: string | null) => {
    onChange?.(newValue ?? "");
  };

  const items = React.useMemo(() => {
    if (!options) return undefined;
    return options.reduce<Record<string, React.ReactNode>>((acc, o) => {
      acc[o.value] = o.text;
      return acc;
    }, {});
  }, [options]);

  return (
    <div
      className={clsx(
        styles.wrapper,
        fluid && styles.fluid,
        disabled && styles.disabled,
        buttonProp && styles.button,
        floating && styles.floating,
        inline && styles.inline,
        className
      )}
    >
      <BaseSelect.Root
        value={value ?? null}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        items={items}
      >
        <BaseSelect.Trigger className={styles.trigger}>
          {trigger ??
            (iconNode ? (
              iconNode
            ) : (
              <>
                <BaseSelect.Value placeholder={placeholder} className={styles.text} />
                <BaseSelect.Icon />
              </>
            ))}
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner align="start">
            <BaseSelect.Popup className={clsx(styles.menu, scrolling && styles.scrolling)}>
              <BaseSelect.List>
                {options
                  ? options.map((opt) => (
                      <BaseSelect.Item
                        key={opt.key || opt.value}
                        value={opt.value}
                        className={clsx(styles.item, opt.value === value && styles.selected)}
                      >
                        <BaseSelect.ItemText>{opt.text}</BaseSelect.ItemText>
                      </BaseSelect.Item>
                    ))
                  : children}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
}
