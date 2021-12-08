import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';

export function useClassName(): (className: string) => string {
  const { isMobile } = useSelector((state: RootState) => state.global);

  return useCallback((className: string): string => {
    return `${className} ${className}-${isMobile ? 'mobile' : 'pc'}`;
  }, [isMobile]);
}
