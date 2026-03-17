import { fetchStudents, deleteStudent as apiDeleteStudent } from '@/apis/studentApi';
import { fetchClasses } from '@/apis/classApi';
import { getClassMap } from './classService';

// 情境一：一個 service 呼叫兩個 API
export const getStudentsWithClass = async () => {
  const [studentsData, classesData] = await Promise.all([
    fetchStudents(),
    fetchClasses(),
  ]);

  const classMap = Object.fromEntries(
    classesData.classes.map(c => [c.id, c.name])
  );

  return studentsData.students.map(s => ({
    ...s,
    classFullName: classMap[s.classId] || 'Unknown',
  }));
};

// 情境二：一個 service 呼叫 API 並使用另一個 service
export const getStudents = async () => {
  const [studentsData, classMap] = await Promise.all([
    fetchStudents(),
    getClassMap(),
  ]);

  console.log('classMap', classMap);

  return studentsData.students.map(s => ({
    ...s,
    classFullName: classMap[s.classId] || 'Unknown',
  }));
};

// 刪除學生
export const removeStudent = async (studentId) => {
  await apiDeleteStudent(studentId);
};