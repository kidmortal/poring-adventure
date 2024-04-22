import styles from './style.module.scss';
import cn from 'classnames';
import { usePagination } from '@/hooks/usePagination';

type PaginationButtonProps = {
  page: number;
  isSelected: boolean;
  onClick: () => void;
};

function PaginationButton({ page, isSelected, onClick }: PaginationButtonProps) {
  return (
    <button
      className={cn(styles.pageButton, {
        [styles.selectedPage]: isSelected,
      })}
      onClick={onClick}
    >
      {page}
    </button>
  );
}

export function Pagination({
  totalCount,
  onPageChange,
  className,
}: {
  totalCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const pagination = usePagination(totalCount, onPageChange);

  const pageButtons = [];
  for (let page = pagination.firstPage; page <= pagination.lastPage; page++) {
    pageButtons.push(
      <PaginationButton
        key={page}
        page={page}
        isSelected={pagination.currentPage === page}
        onClick={() => pagination.handlePageChange(page)}
      />,
    );
  }

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.buttonsContainer}>
        <button
          className={cn(styles.navButton, {
            [styles.disabled]: pagination.currentPage === 1,
          })}
          disabled={pagination.currentPage === 1}
          onClick={() => pagination.handlePageChange(pagination.currentPage - 1)}
        >
          Previous
        </button>
        {pageButtons}
        <button
          className={cn(styles.navButton, {
            [styles.disabled]: pagination.currentPage === pagination.totalPages,
          })}
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => pagination.handlePageChange(pagination.currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
