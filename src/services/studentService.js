import { fetchStudents, deleteStudent as apiDeleteStudent } from '@/apis/studentApi';
import { fetchClasses } from '@/apis/classApi';
import { getClassMap } from './classService';
import { BusinessError, getUserFriendlyMessage } from '@/lib/errors';

// 情境一：一個 service 呼叫兩個 API
// 如果其中一個 API 失敗，提供降級處理
export const getStudentsWithClass = async () => {
  try {
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
  } catch (error) {
    // 如果 fetchClasses 失敗，降級處理：只返回學生資料，班級名稱使用預設值
    console.warn('無法載入完整資料，使用降級模式:', getUserFriendlyMessage(error));

    try {
      const studentsData = await fetchStudents();
      return studentsData.students.map(s => ({
        ...s,
        classFullName: 'Unknown',
      }));
    } catch (fallbackError) {
      // 如果連學生資料都拿不到，拋出錯誤
      throw new BusinessError(
        '無法載入學生資料',
        'FETCH_STUDENTS_FAILED',
        fallbackError
      );
    }
  }
};

// 情境二：一個 service 呼叫 API 並使用另一個 service
// 提供更細緻的降級策略
export const getStudents = async () => {
  try {
    const [studentsData, classMap] = await Promise.all([
      fetchStudents(),
      getClassMap(),
    ]);

    return studentsData.students.map(s => ({
      ...s,
      classFullName: classMap[s.classId] || 'Unknown',
    }));
  } catch (error) {
    // 如果 getClassMap 失敗，降級處理
    console.warn('無法載入班級對照表，使用預設值:', getUserFriendlyMessage(error));

    try {
      const studentsData = await fetchStudents();
      return studentsData.students.map(s => ({
        ...s,
        classFullName: 'Unknown',
      }));
    } catch (fallbackError) {
      // 如果連學生資料都拿不到，拋出錯誤
      throw new BusinessError(
        '無法載入學生資料',
        'FETCH_STUDENTS_FAILED',
        fallbackError
      );
    }
  }
};

// 刪除學生
export const deleteStudent = async (studentId) => {
  try {
    // 驗證 studentId
    if (!studentId) {
      throw new BusinessError('學生 ID 不可為空', 'INVALID_STUDENT_ID');
    }

    await apiDeleteStudent(studentId);
  } catch (error) {
    // 如果是我們自己拋出的 BusinessError，直接向上拋
    if (error instanceof BusinessError) {
      throw error;
    }

    // 包裝其他錯誤
    throw new BusinessError(
      '刪除學生失敗',
      'DELETE_STUDENT_FAILED',
      error
    );
  }
};