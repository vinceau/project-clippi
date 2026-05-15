import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  activePage: number;
  totalPages: number;
  onChange: (activePage: number) => void;
  disabled?: boolean;
}

export function Pagination({ activePage, totalPages, onChange, disabled }: PaginationProps) {
  const siblingRange = 2;

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let i = activePage - siblingRange; i <= activePage + siblingRange; i++) {
    if (i >= 1 && i <= totalPages) {
      pages.add(i);
    }
  }
  const pageNumbers = [...pages].sort((a, b) => a - b);

  const handlePageClick = (page: number) => {
    if (page !== activePage) {
      onChange(page);
    }
  };

  return (
    <nav className={styles.pagination}>
      <button
        className={clsx(styles.button, (disabled || activePage === 1) && styles.disabled)}
        onClick={() => handlePageClick(activePage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {pageNumbers.map((p) => (
        <button
          key={p}
          className={clsx(styles.button, p === activePage && styles.active, disabled && styles.disabled)}
          onClick={() => handlePageClick(p)}
          aria-label={`Page ${p}`}
          aria-current={p === activePage ? "page" : undefined}
        >
          {p}
        </button>
      ))}
      <button
        className={clsx(styles.button, (disabled || activePage === totalPages) && styles.disabled)}
        onClick={() => handlePageClick(activePage + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
