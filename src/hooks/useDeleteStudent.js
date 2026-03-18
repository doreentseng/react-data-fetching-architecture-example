import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStudent } from '@/services/studentService';

/**
 * 刪除學生的 Hook
 * 刪除成功後重新獲取學生列表，失敗時維持原狀
 *
 * @param {Object} options - 選項
 * @param {Function} options.onSuccess - 刪除成功的回調
 * @param {Function} options.onError - 刪除失敗的回調
 *
 * @returns {UseMutationResult} React Query 的 mutation 結果
 *
 * @example
 * // 基本使用
 * const { mutate, isPending } = useDeleteStudent();
 *
 * <button onClick={() => mutate(studentId)}>刪除</button>
 *
 * @example
 * // 自訂成功/失敗處理
 * const { mutate } = useDeleteStudent({
 *   onSuccess: () => toast.success('刪除成功'),
 *   onError: (error) => toast.error(getUserFriendlyMessage(error))
 * });
 */
export const useDeleteStudent = (options = {}) => {
  const {
    onSuccess: customOnSuccess,
    onError: customOnError,
    ...restOptions
  } = options;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudent,

    // 刪除成功後重新獲取學生列表
    onSuccess: (data, studentId, context) => {
      queryClient.invalidateQueries(['students']);
      customOnSuccess?.(data, studentId, context);
    },

    // 失敗時維持原狀（不需要特別處理）
    onError: (error, studentId, context) => {
      customOnError?.(error, studentId, context);
    },

    ...restOptions,
  });
};