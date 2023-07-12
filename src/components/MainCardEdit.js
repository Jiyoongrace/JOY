import React, { useState, useEffect } from 'react';

const MainCardEdit = ({ lesson, createLesson, updateLesson, deleteLesson, students, isLoggedIn }) => {
  const [editedLesson, setEditedLesson] = useState({ ...lesson });
  const [lessons, setLessons] = useState([]); // 레슨 데이터를 저장할 상태

  useEffect(() => {
    setEditedLesson({ ...lesson });
  }, [lesson]);

  useEffect(() => {
    fetchLessons();
  }, []); // 컴포넌트가 마운트될 때 한 번만 레슨 데이터를 가져오도록 설정

  const fetchLessons = () => {
    fetch('http://localhost:3001/lesson')
      .then((res) => res.json())
      .then((json) => {
        setLessons(json.lessons);
      })
      .catch((error) => {
        console.log('Error fetching lessons:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLesson((prevLesson) => ({
      ...prevLesson,
      [name]: value,
    }));
  };

  const handleUpdateLesson = () => {
    updateLesson(editedLesson);
  };

  const handleDeleteLesson = () => {
    deleteLesson(lesson.id);
  };

  const handleCreateLesson = () => {
    const newLesson = {
      ...editedLesson,
      tutorId: lesson.username, // Set the tutorId to the lesson's username
    };
    createLesson(newLesson);
  };

  return (
    <div className="main-card">
      <select
        name="username"
        value={editedLesson.username || ''}
        onChange={handleInputChange}
        disabled={!isLoggedIn} // Disable the select field if not logged in
      >
        <option value="">-- Select Student --</option>
        {students.map((student) => (
          <option key={student} value={student}>
            {student}
          </option>
        ))}
      </select>
      <input
        type="number"
        name="num"
        value={editedLesson.num || ''}
        onChange={handleInputChange}
        disabled={!isLoggedIn} // Disable the input field if not logged in
      />
      <input
        type="text"
        name="date"
        value={editedLesson.date || ''}
        onChange={handleInputChange}
        disabled={!isLoggedIn} // Disable the input field if not logged in
      />
      {isLoggedIn ? (
        <>
          <button onClick={handleUpdateLesson}>Update</button>
          <button onClick={handleDeleteLesson}>Delete</button>
        </>
      ) : (
        <button onClick={handleCreateLesson}>Create</button>
      )}
    </div>
  );
};

export default MainCardEdit;
