import axiosClient from '@/lib/axiosClient';

// 取得班級列表
export const fetchClasses = async () => {
  const { data } = await axiosClient.get('/classes');
  return data;
};
