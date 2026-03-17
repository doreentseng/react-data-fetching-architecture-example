import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeStudent } from '@/services/studentService';

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeStudent,

    // 刪除成功後執行
    // 重新抓取 'students' 資料，使列表更新
    onSuccess: () => queryClient.invalidateQueries(['students']),
  });
};