function formatMemory(memory?: number) {
  if (!memory) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];

  let index = 0;
  let value = memory;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }

  return `${value.toFixed(2)} ${units[index]}`;
}

export const Utils = {
  formatMemory,
};
