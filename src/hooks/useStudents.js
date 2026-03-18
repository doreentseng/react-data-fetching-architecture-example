import { useQuery } from '@tanstack/react-query';
import { getStudents } from '@/services/studentService';
import { isRetryableError } from '@/lib/errors';

/**
 * 取得學生列表的 Hook
 * @param {Object} options - React Query 的選項，可覆寫預設設定
 * @returns {UseQueryResult} React Query 的查詢結果
 *
 * @example
 * // 基本使用
 * const { data, error, isError } = useStudents();
 *
 * @example
 * // 自訂錯誤處理
 * const { data } = useStudents({
 *   onError: (error) => toast.error(getUserFriendlyMessage(error))
 * });
 */
export const useStudents = () => {
  return useQuery({
    queryKey: ['students'], // Query 的唯一鍵值，用來辨識和快取這筆 'students' 資料
    queryFn: getStudents,
    staleTime: 1000 * 60,

    // 重試策略：只重試網路錯誤和伺服器錯誤
    retry: (failureCount, error) => {
      // 最多重試 3 次
      if (failureCount >= 3) return false;

      // 使用 isRetryableError 判斷是否應該重試
      return isRetryableError(error);
    },

    // 重試延遲：指數退避策略（1s, 2s, 4s, 最多 30s）
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};