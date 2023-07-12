import React, { useState, useEffect } from 'react';

const SubjectManagement = ({ students }) => {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [book, setBook] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = () => {
    fetch('/subjects')
      .then((res) => res.json())
      .then((json) => {
        setSubjects(json.subjects);
      })
      .catch((error) => {
        console.log('Error fetching subjects:', error);
      });
  };

  const handleCreateSubject = () => {
    fetch('/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subjectName,
        totalPages,
        book,
        selectedStudent,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          fetchSubjects();
          setSubjectName('');
          setTotalPages('');
          setBook('');
        }
      })
      .catch((error) => {
        console.log('Error creating subject:', error);
      });
  };

  const handleUpdateSubject = (subjectId) => {
    const updatedSubject = subjects.find((subject) => subject.id === subjectId);
  
    if (updatedSubject) {
      const updatedSubjects = subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            subjectName: updatedSubject.subjectName,
            totalPages: updatedSubject.totalPages,
            book: updatedSubject.book,
            subjectTutee: selectedStudent,
          };
        }
        return subject;
      });
  
      setSubjects(updatedSubjects);
  
      fetch(`/subjects/${subjectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectName: updatedSubject.subjectName,
          totalPages: updatedSubject.totalPages,
          book: updatedSubject.book,
          subjectTutee: selectedStudent,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            fetchSubjects();
          }
        })
        .catch((error) => {
          console.log('Error updating subject:', error);
        });
    }
  };
  
  

  const handleDeleteSubject = (subjectId) => {
    fetch(`/subjects/${subjectId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          fetchSubjects();
        }
      })
      .catch((error) => {
        console.log('Error deleting subject:', error);
      });
  };

  return (
    <div>
      <h2>과목 추가</h2>
      {students && students.length > 0 && (
        <div>
          <h3>학생 선택</h3>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
          <option value="">-- Select Student --</option>
          {students.map((student, index) => (
            <option key={index} value={student}>
              {student}
            </option>
          ))}
        </select>
        </div>
      )}
      <br />
      <div>
        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Total Pages"
          value={totalPages}
          onChange={(e) => setTotalPages(e.target.value)}
        />
        <input
          type="text"
          placeholder="Book"
          value={book}
          onChange={(e) => setBook(e.target.value)}
        />
        <button onClick={handleCreateSubject}>Create Subject</button>
      </div>

      <br></br>
      <br></br>

      <h3>관리하고 있는 학생&과목 목록</h3>
      <div>
        {subjects.map((subject) => (
          <div key={subject.id}>
            <div>학생: {subject.subjectTutee}</div>
            <input
              type="text"
              value={subject.subjectName}
              onChange={(e) => {
                const updatedSubjects = subjects.map((s) =>
                  s.id === subject.id ? { ...s, subjectName: e.target.value } : s
                );
                setSubjects(updatedSubjects);
              }}
            />
            <input
              type="text"
              value={subject.totalPages}
              onChange={(e) => {
                const updatedSubjects = subjects.map((s) =>
                  s.id === subject.id ? { ...s, totalPages: e.target.value } : s
                );
                setSubjects(updatedSubjects);
              }}
            />
            <input
              type="text"
              value={subject.book}
              onChange={(e) => {
                const updatedSubjects = subjects.map((s) =>
                  s.id === subject.id ? { ...s, book: e.target.value } : s
                );
                setSubjects(updatedSubjects);
              }}
            />
            <button onClick={() => handleUpdateSubject(subject.id)}>Update</button>
            <button onClick={() => handleDeleteSubject(subject.id)}>Delete</button>
          <br></br><br></br></div>
        ))}
      </div>
    </div>
  );
};

export default SubjectManagement;
