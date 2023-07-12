import React from 'react';

const LessonDiary = ({ lessons, onOpenMainCard }) => {
  return (
    <div>
      <h2>수업 일지:</h2>
      {lessons.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>수업</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td>{lesson.name}</td>
                <td>{lesson.num}회차</td>
                <td>{lesson.date}</td>
                <td>
                  <button onClick={() => onOpenMainCard(lesson)}>편집</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>수업일지가 없습니다.</p>
      )}
    </div>
  );
};

export default LessonDiary;
