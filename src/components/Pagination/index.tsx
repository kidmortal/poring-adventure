import { useState } from "react";
import styles from "./style.module.scss";
import cn from "classnames";

export function Pagination(props: {
  totalCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(props.totalCount / 10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    props.onPageChange(page);
  };

  return (
    <div className={cn(styles.container, props.className)}>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            className={cn({ [styles.selectedPage]: currentPage === page })}
            key={page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
}
