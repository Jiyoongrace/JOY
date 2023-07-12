import React, { useState, useEffect } from 'react';

const UserInfoEdit = ({ userData, setMode, fetchUserInfo }) => {
  const [name, setName] = useState(userData.name);
  const [username, setUsername] = useState(userData.username);
  const [password, setPassword] = useState('');
  const [color, setColor] = useState(userData.color || '');

  useEffect(() => {
    if (userData.color) {
      setColor(userData.color);
    }
  }, [userData.color]);

  const handleUpdate = () => {
    const updatedData = {
      name: name,
      newUsername: username,
      newPassword: password,
      color: color,
    };

    fetch('http://localhost:3001/userinfo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          fetchUserInfo();
          setMode('WELCOME');
          alert('User information updated successfully!');
        } else {
          alert('Failed to update user information');
        }
      })
      .catch((error) => {
        console.log('Error updating user information:', error);
        alert('Failed to update user information');
      });
  };

  return (
    <>
      <h2>회원정보 수정</h2>
      <div className="form">
        <p>
          <input
            className="login"
            type="text"
            placeholder="이름"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </p>
        <p>
          <input
            className="login"
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </p>
        <p>
          <input
            className="login"
            type="password"
            placeholder="새로운 비밀번호"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </p>
        <p>
          <input
            className="login"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </p>
        <p>
          <input className="btn" type="submit" value="수정하기" onClick={handleUpdate} />
        </p>
      </div>
      <p>
        <button onClick={() => setMode('WELCOME')}>취소</button>
      </p>
    </>
  );
};

export default UserInfoEdit;
