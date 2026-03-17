import axiosClient from '@/lib/axiosClient';

// 取得學生列表
export const fetchStudents = async () => {
  const { data } = await axiosClient.get('/students');
  return data;
};

// 刪除學生
export const deleteStudent = async (studentId) => {
  const { data } = await axiosClient.delete(`/students/${studentId}`);
  return data;
};