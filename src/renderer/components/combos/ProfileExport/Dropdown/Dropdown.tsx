import React from "react";
import { Icon } from "@/ui/Icon/Icon";
import { Select, type SelectProps } from "@/ui/Select/Select";
import styles from "./Dropdown.module.css";

interface DropdownMenuProps {
  children?: React.ReactNode;
}

interface DropdownItemProps {
  icon?: string;
  text?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className={styles.menu}>{children}</div>;
}
DropdownMenu.defaultProps = { children: undefined };

function DropdownItem({ icon: iconName, text, onClick, children }: DropdownItemProps) {
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick?.();
    }
  };
  return (
    <div className={styles.item} onClick={onClick} onKeyDown={onKeyDown} role="menuitem" tabIndex={0}>
      {iconName && <Icon name={iconName as any} />}
      {text && <span>{text}</span>}
      {children}
    </div>
  );
}
DropdownItem.defaultProps = { children: undefined, icon: undefined, text: undefined, onClick: undefined };

const Dropdown = Object.assign(Select, {
  Menu: DropdownMenu,
  Item: DropdownItem,
});

export { Dropdown };
export type { SelectProps as DropdownProps };
