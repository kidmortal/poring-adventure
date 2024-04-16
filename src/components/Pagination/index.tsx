import { useState } from "react";
import styles from "./style.module.scss";
import cn from "classnames";

export function Pagination({
  totalCount,
  onPageChange,
  className,
}: {
  totalCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / 10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  // Calculate the range of page numbers to display
  const firstPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const lastPage = Math.min(totalPages, firstPage + 4);

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.buttonsContainer}>
        <button
          className={cn(styles.navButton, {
            [styles.disabled]: currentPage === 1,
          })}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from(
          { length: lastPage - firstPage + 1 },
          (_, index) => firstPage + index
        ).map((page) => (
          <button
            className={cn(styles.pageButton, {
              [styles.selectedPage]: currentPage === page,
            })}
            key={page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className={cn(styles.navButton, {
            [styles.disabled]: currentPage === totalPages,
          })}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
