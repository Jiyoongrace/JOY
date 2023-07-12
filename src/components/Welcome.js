import React from 'react';

const Welcome = ({ name, username, role, students, onLogout }) => {

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div>
      <h2>Welcome, {name}!</h2>
      <p>역할: {role === 1 ? '선생님' : '학생'}</p>
      <p>아이디: {username}</p>
      {role === 1 && students.length > 0 && (
        <div>
          <h2>담당 학생:</h2>
          <ul>
            {students.map((student) => (
              <li key={student}>{student}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default Welcome;
