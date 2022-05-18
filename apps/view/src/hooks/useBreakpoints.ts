import { BreakpointsOptions } from '@mui/material';
import { useEffect, useState } from 'react';
import { breakpoints as _breakpoints } from '../constants/breakpoints';

type BreakpointChecker = {
  up: (key: number | string) => boolean;
  down: (key: number | string) => boolean;
  between: (start: number | string, end: number | string) => boolean;
};

export function useBreakpoints(
  brkPoints: BreakpointsOptions = _breakpoints,
): BreakpointChecker {
  const [, setWidth] = useState<[string, number]>(null);
  const breakpoints: [string, number][] = Object.keys(brkPoints.values)
    .map((key): [string, number] => [key, brkPoints.values[key]])
    .sort((b1, b2) => b1[1] - b2[1]);

  useEffect(() => {
    const listener = () => {
      const { innerWidth } = window;

      for (const breakpoint of breakpoints)
        if (innerWidth < breakpoint[1]) {
          setWidth(breakpoint);
          return;
        }
    };

    window.addEventListener('resize', listener);

    listener();
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  return {
    up(key: number | string): boolean {
      if (typeof key === 'number') return window.innerWidth > key;
      if (!(key in brkPoints.values)) return false;
      return window.innerWidth > brkPoints.values[key];
    },
    down(key: number | string): boolean {
      if (typeof key === 'number') return window.innerWidth < key;
      if (!(key in brkPoints.values)) return false;
      return window.innerWidth < brkPoints.values[key];
    },
    between(start: number | string, end: number | string): boolean {
      let min, max;
      if (typeof start === 'number') min = start;
      if (typeof end === 'number') max = end;
      if (!(start in brkPoints.values)) return false;
      else min = brkPoints.values[start];
      if (!(end in brkPoints.values)) return false;
      else max = brkPoints.values[end];
      return window.innerWidth > min && window.innerWidth < max;
    },
  };
}
