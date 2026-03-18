import { fetchClasses } from '@/apis/classApi';
import { BusinessError } from '@/lib/errors';

export const getClassMap = async () => {
  try {
    const classesData = await fetchClasses();

    // 驗證資料格式
    if (!classesData || !Array.isArray(classesData.classes)) {
      console.warn('班級資料格式錯誤，返回空對照表');
      return {};
    }

    return Object.fromEntries(
      classesData.classes.map(c => [c.id, `${c.grade}年${c.class}班`])
    );
  } catch (error) {
    // 記錄錯誤但不中斷流程，返回空的對照表
    console.error('載入班級對照表失敗，返回空對照表:', error);

    // 可以選擇拋出錯誤或返回空物件
    // 這裡選擇返回空物件，讓呼叫方可以繼續執行
    return {};

    // 如果要拋出錯誤，可以使用：
    // throw new BusinessError(
    //   '無法載入班級資料',
    //   'FETCH_CLASSES_FAILED',
    //   error
    // );
  }
};