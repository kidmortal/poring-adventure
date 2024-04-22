import { useState } from 'react';

export function usePagination(totalCount: number, onPageChange: (page: number) => void) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / 10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  // Calculate the range of page numbers to display
  const firstPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const lastPage = Math.min(totalPages, firstPage + 4);

  return {
    currentPage,
    totalPages,
    handlePageChange,
    firstPage,
    lastPage,
  };
}
