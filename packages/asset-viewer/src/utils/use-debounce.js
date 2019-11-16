import { useMemo } from 'react';
import debounce from 'lodash/debounce';

export default function useDebounce(func, { delay = 100, leading = false }) {
  return useMemo(() => (
    debounce(func, delay, { leading })
  ), [delay, func, leading]);
}
