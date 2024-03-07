import { useCallback, useEffect, useRef } from "react";

type DetectClickProps = {
  onClickOutside: () => void;
};

export function useDetectClickOutsideElement({
  onClickOutside,
}: DetectClickProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClickOutside();
      }
    },
    [onClickOutside]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return { containerRef };
}
