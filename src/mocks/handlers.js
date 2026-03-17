import { http, HttpResponse } from 'msw';

// mock database
let students = [
  { id: 1, name: "孫尚香", classId: 1, gender: "女", birthday: "2016-02-15" },
  { id: 2, name: "諸葛亮", classId: 2, gender: "男", birthday: "2016-06-03" },
  { id: 3, name: "李清照", classId: 1, gender: "女", birthday: "2016-09-21" },
  { id: 4, name: "蘇軾", classId: 3, gender: "男", birthday: "2015-11-12" },
  { id: 5, name: "蔡文姬", classId: 2, gender: "女", birthday: "2016-04-18" }
];

const classes = [
  { id: 1, grade: "1", class: "1" },
  { id: 2, grade: "1", class: "2" },
  { id: 3, grade: "2", class: "1" },
  { id: 4, grade: "1", class: "1" }
];

export const handlers = [
  // 取得學生
  http.get('https://api.example.com/v1/students', () => {
    return HttpResponse.json({
      students
    });
  }),

  // 取得班級
  http.get('https://api.example.com/v1/classes', () => {
    return HttpResponse.json({
      classes
    });
  }),

  // 刪除學生
  http.delete('https://api.example.com/v1/students/:id', ({ params }) => {
    const id = Number(params.id);
    students = students.filter(student => student.id !== id);
    return HttpResponse.json({
      success: true
    });
  }),
];