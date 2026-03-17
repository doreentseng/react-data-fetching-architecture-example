import { fetchClasses } from '@/apis/classApi';

export const getClassMap = async () => {
  const classesData = await fetchClasses();

  return Object.fromEntries(
    classesData.classes.map(c => [c.id, `${c.grade}年${c.class}班`])
  );
};