import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signin from './components/Signin';
import Welcome from './components/Welcome';
import UserInfoEdit from './components/UserInfoEdit';
import SubjectManagement from './components/SubjectManagement';
import Calendar from './components/Calendar';
import NavigationBar from './components/NavigationBar';
import MainCardEdit from './components/MainCardEdit';
import LessonDiary from './components/LessonDiary';

import './App.css';

const App = () => {
  const [mode, setMode] = useState('');
  const [userData, setUserData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [editedLesson, setEditedLesson] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/authcheck')
      .then((res) => res.json())
      .then((json) => {
        if (json.isLogin === 'True') {
          fetchUserInfo();
          setIsLoggedIn(true);
          setMode('WELCOME');
        } else {
          setIsLoggedIn(false);
          setMode('LOGIN');
        }
      });
  }, []);

  useEffect(() => {
    if (mode === 'WELCOME') {
      fetchUserInfo();
      fetchLessons();
    }
  }, [mode]);

  const fetchUserInfo = () => {
    fetch('http://localhost:3001/userinfo')
      .then((res) => res.json())
      .then((json) => {
        setUserData(json.user);
      })
      .catch((error) => {
        console.log('Error fetching user information:', error);
      });
  };

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

  const createLesson = (newLesson) => {
    fetch('http://localhost:3001/lesson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLesson),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLessons((prevLessons) => [...prevLessons, newLesson]);
          console.log('Lesson created successfully');
        } else {
          console.log('Failed to create lesson');
        }
      })
      .catch((error) => {
        console.log('Error creating lesson:', error);
      });
  };

  const updateLesson = (updatedLesson) => {
    fetch(`http://localhost:3001/lesson/${updatedLesson.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedLesson),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLessons((prevLessons) =>
            prevLessons.map((lesson) =>
              lesson.id === updatedLesson.id ? updatedLesson : lesson
            )
          );
          console.log('Lesson updated successfully');
        } else {
          console.log('Failed to update lesson');
        }
      })
      .catch((error) => {
        console.log('Error updating lesson:', error);
      });
  };

  const deleteLesson = (lessonId) => {
    fetch(`http://localhost:3001/lesson/${lessonId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLessons((prevLessons) =>
            prevLessons.filter((lesson) => lesson.id !== lessonId)
          );
          console.log('Lesson deleted successfully');
        } else {
          console.log('Failed to delete lesson');
        }
      })
.catch((error) => {
        console.log('Error deleting lesson:', error);
      });
  };

  const handleOpenMainCard = (lesson) => {
    setEditedLesson(lesson);
    setMode('MAIN_CARD');
  };

  const handleUpdateLesson = (updatedLesson) => {
    updateLesson(updatedLesson);
  };

  const handleDeleteLesson = (lessonId) => {
    deleteLesson(lessonId);
  };

  const handleCreateLesson = (newLesson) => {
    createLesson(newLesson);
  };

  const handleLogout = () => {
    fetch('http://localhost:3001/logout')
      .then(() => {
        setIsLoggedIn(false);
        setMode('LOGIN');
      })
      .catch((error) => {
        console.log('Error logging out:', error);
      });
  };
  
  let content = null;

  if (mode === 'LOGIN') {
    content = <Login setMode={setMode} />;
  } else if (mode === 'SIGNIN') {
    content = <Signin setMode={setMode} />;
  } else if (mode === 'WELCOME') {
    content = (
      <>
        <Welcome
          name={userData.name}
          username={userData.username}
          role={userData.role}
          students={userData.students}
          lessons={lessons}
          onOpenMainCard={handleOpenMainCard}
          onLogout={handleLogout}
        />
      </>
    );
  } else if (mode === 'USER_INFO_EDIT') {
    content = (
      <UserInfoEdit
        userData={userData}
        setMode={setMode}
        fetchUserInfo={fetchUserInfo}
      />
    );
  } else if (mode === 'SUBJECT_MANAGEMENT' && userData.role !== 2) {
    content = <SubjectManagement students={userData.students} />;
  } else if (mode === 'CALENDAR' && userData.role !== 2) {
    content = <Calendar students={userData.students} />;
  } else if (mode === 'MAIN_CARD' && userData.role !== 2) {
    content = (
      <MainCardEdit
        lesson={editedLesson}
        createLesson={handleCreateLesson}
        updateLesson={handleUpdateLesson}
        deleteLesson={handleDeleteLesson}
        students={userData.students}
        isLoggedIn={isLoggedIn}
      />
    );
  } else if (mode === 'LESSON_DIARY') {
    content = <LessonDiary lessons={lessons} onOpenMainCard={handleOpenMainCard} />;

  }

  return (
    <div className="background">
      <NavigationBar setMode={setMode} isLoggedIn={isLoggedIn} />
      {content}
    </div>
  );
};

export default App;