const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3001;

const db = require('./lib/db');
const sessionOption = require('./lib/sessionOption');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const multer = require('multer'); // Add multer dependency

// Configure multer for storing uploaded profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './profile-images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);

app.use(session({  
  key: 'session_cookie_name',
  secret: '~',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

app.get('/', (req, res) => {    
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.get('/authcheck', (req, res) => {      
  const sendData = { isLogin: "" };
  if (req.session.is_logined) {
    sendData.isLogin = "True";
  } else {
    sendData.isLogin = "False";
  }
  res.send(sendData);
});

app.get('/userinfo', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname; // Assuming nickname contains the username
    db.query('SELECT name, username, role FROM userTable WHERE username = ?', [username], function (error, results, fields) {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length > 0) {
          const userInfo = {
            name: results[0].name,
            username: results[0].username,
            role: results[0].role,
          };
          if (userInfo.role === 1) {
            db.query('SELECT name FROM userTable WHERE tutorId = ?', [username], function (error, results, fields) {
              if (error) {
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                const studentNames = results.map(result => result.name);
                userInfo.students = studentNames;
                res.json({ user: userInfo });
              }
            });
          } else {
            res.json({ user: userInfo });
          }
        } else {
          res.status(200).json({ user: null });
        }
      }
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});


app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

app.post("/login", (req, res) => {
  const username = req.body.userId;
  const password = req.body.userPassword;
  const sendData = { isLogin: "" };

  if (username && password) {
    db.query('SELECT * FROM userTable WHERE username = ?', [username], function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, (err, result) => {
          if (result === true) {
            req.session.is_logined = true;
            req.session.nickname = username;
            req.session.save(function () {
              sendData.isLogin = "True";
              res.send(sendData);
            });
            db.query(`INSERT INTO logTable (created, username, action, command, actiondetail) VALUES (NOW(), ?, 'login', ?, ?)`,
              [req.session.nickname, '-', `React 로그인 테스트`], function (error, result) { });
          } else {
            sendData.isLogin = "로그인 정보가 일치하지 않습니다.";
            res.send(sendData);
          }
        });
      } else {
        sendData.isLogin = "아이디 정보가 일치하지 않습니다.";
        res.send(sendData);
      }
    });
  } else {
    sendData.isLogin = "아이디와 비밀번호를 입력하세요!";
    res.send(sendData);
  }
});

app.post("/signin", (req, res) => {
  const username = req.body.userId;
  const password = req.body.userPassword;
  const password2 = req.body.userPassword2;
  const name = req.body.userName;
  const role = req.body.role;
  const phone = req.body.phone;
  const tutorId = req.body.tutorId;
  const color = req.body.color;

  const sendData = { isSuccess: "" };

  if (username && password && password2 && name && role) {
    db.query(
      "SELECT * FROM userTable WHERE username = ?",
      [username],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length <= 0 && password === password2) {
          const hashedPassword = bcrypt.hashSync(password, 10);
          let query;
          let values;
          if (role === 1) {
            // Teacher
            query =
              "INSERT INTO userTable (username, password, name, role, phone, color) VALUES (?, ?, ?, ?, ?, ?)";
            values = [username, hashedPassword, name, role, phone, color];
          } else if (role === 2) {
            // Student
            query =
              "INSERT INTO userTable (username, password, name, role, tutorId, phone, color) VALUES (?, ?, ?, ?, ?, ?, ?)";
            values = [username, hashedPassword, name, role, tutorId, phone, color];
          }
          db.query(query, values, function (error, data) {
            if (error) throw error;
            req.session.save(function () {
              sendData.isSuccess = "True";
              res.send(sendData);
            });
          });
        } else if (password !== password2) {
          sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다.";
          res.send(sendData);
        } else {
          sendData.isSuccess = "이미 존재하는 아이디입니다!";
          res.send(sendData);
        }
      }
    );
  } else {
    sendData.isSuccess = "아이디, 비밀번호, 이름, 역할을 입력하세요!";
    res.send(sendData);
  }
});

app.put('/userinfo', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname; // Assuming nickname contains the username
    const { name, newUsername, newPassword, color } = req.body;

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    db.query(
      'UPDATE userTable SET name = ?, username = ?, password = ?, color = ? WHERE username = ?',
      [name, newUsername, hashedPassword, color, username],
      function (error, results, fields) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.affectedRows > 0) {
          req.session.nickname = newUsername; // Update the session nickname with the new username

          // Update lesson color based on matching name
          db.query(
            'UPDATE lessontable SET color = ? WHERE name = ?',
            [color, name],
            function (error, results) {
              if (error) {
                console.log('Error updating lesson color:', error);
              } else {
                console.log(`Lesson color updated for user with name: ${name}`);
              }
            }
          );

          res.json({ success: true });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});


app.get('/subjects', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;

    db.query(
      'SELECT s.id, s.subjectName, s.totalPages, s.book, s.subjectTutee, u.name AS studentName FROM subjectTable s LEFT JOIN userTable u ON s.subjectTutee = u.username WHERE s.username = ?',
      [username],
      function (error, results) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ subjects: results });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.post('/subjects', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;
    const { subjectName, totalPages, selectedStudent, book } = req.body;

    db.query(
      'INSERT INTO subjectTable (username, subjectName, totalPages, subjectTutee, book) VALUES (?, ?, ?, ?, ?)',
      [username, subjectName, totalPages, selectedStudent, book],
      function (error, result) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ success: true });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.put('/subjects/:subjectId', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;
    const subjectId = req.params.subjectId;
    const { subjectName, totalPages, book, subjectTutee } = req.body;

    db.query(
      'UPDATE subjectTable SET subjectName = ?, totalPages = ?, book = ?, subjectTutee = ? WHERE username = ? AND id = ?',
      [subjectName, totalPages, book, subjectTutee, username, subjectId],
      function (error, result) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (result.affectedRows > 0) {
          res.json({ success: true });
        } else {
          res.status(404).json({ error: 'Subject not found' });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});


app.delete('/subjects/:subjectId', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;
    const subjectId = req.params.subjectId;

    db.query('DELETE FROM subjectTable WHERE username = ? AND id = ?', [username, subjectId], function (error, result) {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Subject not found' });
      }
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

// 수업일지
app.get('/lesson', (req, res) => {

  if (req.session.is_logined) {
    const tutorId = req.session.nickname; // Assuming nickname contains the username

    db.query(
      'SELECT * FROM lessontable WHERE tutorId = ?',
      [tutorId],
      function (error, results) {
        if (error) {
          console.log('Error executing query:', error); // 에러 발생 시 에러 로그 출력
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ lessons: results });
        }
      }
    );
  } else {
    console.log('User not logged in'); // 로그인 상태 확인을 위한 로그 출력
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.post('/lesson', (req, res) => {
  if (req.session.is_logined) {
    const tutorId = req.session.nickname; // Assuming nickname contains the username
    const { name, num, date } = req.body;

    db.query(
      'INSERT INTO lessontable (name, num, date, tutorId, color) SELECT ?, ?, ?, ?, color FROM usertable WHERE name = ?',
      [name, num, date, tutorId, name],
      function (error, result) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ success: true });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});


app.put('/lesson/:id', (req, res) => {
  if (req.session.is_logined) {
    const tutorId = req.session.nickname; // Assuming nickname contains the username
    const lessonId = req.params.id;
    const { name, num, date } = req.body;

    db.query(
      'UPDATE lessontable SET name = ?, num = ?, date = ? WHERE id = ? AND tutorId = ?',
      [name, num, date, lessonId, tutorId],
      function (error, result) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (result.affectedRows > 0) {
          res.json({ success: true });
        } else {
          res.status(404).json({ error: 'Lesson not found' });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.delete('/lesson/:id', (req, res) => {
  if (req.session.is_logined) {
    const tutorId = req.session.nickname; // Assuming nickname contains the username
    const lessonId = req.params.id;

    db.query(
      'DELETE FROM lessontable WHERE id = ? AND tutorId = ?',
      [lessonId, tutorId],
      function (error, result) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (result.affectedRows > 0) {
          res.json({ success: true });
        } else {
          res.status(404).json({ error: 'Lesson not found' });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
