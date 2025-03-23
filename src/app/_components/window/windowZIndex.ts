export const zIndexCounter = {
  value: 0,
  increment: () => zIndexCounter.value++,
  get: () => zIndexCounter.value,
};
