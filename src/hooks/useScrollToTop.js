import { useEffect } from 'react';

/**
 * Hook để cuộn trang về đầu khi component mount
 * Gọi window.scrollTo(0, 0) mỗi khi component được render
 */
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
