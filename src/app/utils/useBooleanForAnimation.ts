import { useDebounce } from "@uidotdev/usehooks";

export const useBooleanForAnimation = (
  value: boolean,
  openingDelay: number,
  closingDelay: number,
) => {
  const openingDebouncedIsOpen = useDebounce(value, openingDelay);
  const closingDebouncedIsOpen = useDebounce(value, closingDelay);

  const isOpenFullLength = value || closingDebouncedIsOpen;
  const isOpenForAnimation = openingDebouncedIsOpen && value;

  const isAnimating = !value || closingDebouncedIsOpen;

  return [isOpenFullLength, isOpenForAnimation, isAnimating];
};
