import { useState, useEffect } from 'react';
import { useStudents } from '@/hooks/useStudents';
import { useDeleteStudent } from '@/hooks/useDeleteStudent';
import { getUserFriendlyMessage } from '@/lib/errors';
import './StudentDashboard.css';

function StudentDashboard() {
  const [successMessage, setSuccessMessage] = useState('');

  // 使用 hook 並取得錯誤狀態
  const { data: students, isLoading, isError, error, refetch } = useStudents();
  const {
    mutate: deleteStudent,
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteStudent({
    onSuccess: () => {
      setSuccessMessage('刪除成功！');
    }
  });

  // 成功訊息自動消失
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  
  // 載入中狀態
  if (isLoading) {
    return <div className="loading">載入中...</div>;
  }

  // 錯誤狀態 - 在 Component 層處理錯誤顯示
  if (isError) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <h3>無法載入學生資料</h3>
          <p className="error-message">{getUserFriendlyMessage(error)}</p>
          <button className="retry-btn" onClick={() => refetch()}>
            重試
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>學生列表</h2>

      {/* 刪除成功提示 */}
      {successMessage && (
        <div className="success-banner">
          {successMessage}
        </div>
      )}

      {/* 刪除錯誤提示 - inline 顯示 */}
      {isDeleteError && (
        <div className="error-banner">
          {getUserFriendlyMessage(deleteError)}
        </div>
      )}

      <ul className="student-list">
        <li className="student-header">
          <span>姓名</span>
          <span>性別</span>
          <span>班級</span>
          <span>生日</span>
          <span></span>
        </li>

        {students.length === 0 ? (
          <li className="student-empty">目前沒有學生資料</li>
        ) : (
          students.map((s) => (
            <li key={s.id} className="student-item">
              <span className="student-name">{s.name}</span>
              <span className="student-gender">{s.gender}</span>
              <span className="student-class">{s.classFullName}</span>
              <span className="student-birthday">{s.birthday}</span>
              <button
                className="delete-btn"
                onClick={() => deleteStudent(s.id)}
                disabled={isDeleting}
              >
                {isDeleting ? '刪除中...' : '刪除'}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default StudentDashboard;