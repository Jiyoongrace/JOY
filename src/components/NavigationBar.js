import React from 'react';

const NavigationBar = ({ setMode, isLoggedIn }) => {
  const handleModeChange = (mode) => {
    if (!isLoggedIn) {
      alert('로그인을 해주세요!');
    } else {
      setMode(mode);
    }
  };

  return (
    <div className="navbar">
      <>
        <button onClick={() => handleModeChange('WELCOME')}>마이페이지</button>
        <button onClick={() => handleModeChange('SUBJECT_MANAGEMENT')}>
          과목 관리
        </button>
        <button onClick={() => handleModeChange('USER_INFO_EDIT')}>
          회원정보 수정
        </button>
        <button onClick={() => handleModeChange('CALENDAR')}>캘린더</button>
        <button onClick={() => handleModeChange('LESSON_DIARY')}>
          수업 일지
        </button>
      </>
    </div>
  );
};

export default NavigationBar;
