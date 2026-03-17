import { useQuery } from '@tanstack/react-query';
import { getStudents } from '@/services/studentService';

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'], // Query 的唯一鍵值，用來辨識和快取這筆 'students' 資料
    queryFn: getStudents,
    staleTime: 1000 * 60,
  });
};