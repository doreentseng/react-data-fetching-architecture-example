import { useStudents } from '@/hooks/useStudents';
import { useDeleteStudent } from '@/hooks/useDeleteStudent';
import './StudentDashboard.css';

function StudentDashboard() {
  const { data: students, isLoading } = useStudents();
  const { mutate: deleteStudent } = useDeleteStudent();

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h2>學生列表</h2>
      <ul className="student-list">
        <li className="student-header">
          <span>姓名</span>
          <span>性別</span>
          <span>班級</span>
          <span>生日</span>
          <span></span>
        </li>

        {students.length === 0 ? (
          <li className="student-empty">
            目前沒有學生資料
          </li>
        ) : (
          students.map(s => (
            <li key={s.id} className="student-item">
              <span className="student-name">{s.name}</span>
              <span className="student-gender">{s.gender}</span>
              <span className="student-class">{s.classFullName}</span>
              <span className="student-birthday">{s.birthday}</span>
              <button
                className="delete-btn"
                onClick={() => deleteStudent(s.id)}
              >
                刪除
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default StudentDashboard;