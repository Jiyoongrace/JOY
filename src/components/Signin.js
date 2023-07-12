import React, { useState } from 'react';

const Signin = (props) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tutorId, setTutorId] = useState('');
  const [role, setRole] = useState(1);
  const [color, setColor] = useState('#000000'); // Set initial color value to black

  const handleRoleChange = (event) => {
    setRole(parseInt(event.target.value));
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  return (
    <>
      <h2>회원가입</h2>

      <div className="form">
        {/* Role selection */}
        <p>
          <label>
            <input
              type="radio"
              name="role"
              value={1} // 1 represents teacher
              checked={role === 1}
              onChange={handleRoleChange}
            />
            선생님
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value={2} // 2 represents student
              checked={role === 2}
              onChange={handleRoleChange}
            />
            학생
          </label>
        </p>

        {/* Input fields based on selected role */}
        {role === 1 ? (
          // Render teacher form if role is 1 (teacher)
          <>
            <p>
              <input
                className="login"
                type="text"
                placeholder="이름"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="text"
                placeholder="아이디"
                onChange={(event) => {
                  setId(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="password"
                placeholder="비밀번호"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="password"
                placeholder="비밀번호 확인"
                onChange={(event) => {
                  setPassword2(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="text"
                placeholder="전화번호"
                onChange={(event) => {
                  setPhone(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="color"
                value={color}
                onChange={handleColorChange}
              />
            </p>
          </>
        ) : (
          // Render student form if role is 2 (student)
          <>
            <p>
              <input
                className="login"
                type="text"
                placeholder="선생님 아이디"
                onChange={(event) => {
                  setTutorId(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="text"
                placeholder="학부모 전화번호"
                onChange={(event) => {
                  setPhone(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="text"
                placeholder="이름"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="text"
                placeholder="아이디"
                onChange={(event) => {
                  setId(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="password"
                placeholder="비밀번호"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="password"
                placeholder="비밀번호 확인"
                onChange={(event) => {
                  setPassword2(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="login"
                type="color"
                value={color}
                onChange={handleColorChange}
              />
            </p>
          </>
        )}

        {/* Submit button */}
        <p>
          <input
            className="btn"
            type="submit"
            value="회원가입"
            onClick={() => {
              const userData = {
                userId: id,
                userPassword: password,
                userPassword2: password2,
                userName: name,
                role: role, // Include role in the userData object
                phone: phone, // Include phone in the userData object
                tutorId: tutorId, // Include tutorId in the userData object
                color: color, // Include color in the userData object
              };
              fetch('http://localhost:3001/signin', {
                method: 'post',
                headers: {
                  'content-type': 'application/json',
                },
                body: JSON.stringify(userData),
              })
                .then((res) => res.json())
                .then((json) => {
                  if (json.isSuccess === 'True') {
                    alert('회원가입이 완료되었습니다!');
                    props.setMode('LOGIN');
                  } else {
                    alert(json.isSuccess);
                  }
                });
            }}
          />
        </p>
      </div>

      {/* Login link */}
      <p>
        로그인화면으로 돌아가기{' '}
        <button
          onClick={() => {
            props.setMode('LOGIN');
          }}
        >
          로그인
        </button>
      </p>
    </>
  );
};

export default Signin;
