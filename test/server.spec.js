require('dotenv').config();
process.env.NODE_ENV = 'testing';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');
const Todo = require('../server/api/todo/todo-model');
const User = require('../server/api/user/user-model');
const { infoLog, errorLog, } = require('../server/utils/logger');


describe(infoLog('USERS'), () => {

  const mockUser = {
    username: 'TesterTimmy',
    password: 'test123',
  };

  afterEach(() => {
    User.remove({}, err => {
      if (err) {
        console.error(errorLog('Error while cleaning the Test DB'));
      }
    });
  });

  describe(infoLog('/api/users'), () => {

    it('should post a user', done => {
      request(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, resp) => {
          expect(resp.body).to.be.an('object');
          expect(resp.body.token).to.be.a('string');
          done();
        });
    });
  });

  describe(infoLog('/api/users/usernames'), () => {

    before(async () => {
      const newUser = new User(mockUser);
      try {
        await newUser.save();
      } catch (error) {
        console.log(error);
      }
    });

    it('should return false if username isn\'t available', done => {
      request(app)
        .post('/api/users/usernames')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, resp) => {
          expect(resp.body).to.be.an('object');
          expect(resp.body.isUsernameAvailable).to.be.a('boolean');
          expect(resp.body.isUsernameAvailable).to.equal(false);
          done();
        });
    });

    it('should return true if username is available', done => {

      const fakeUser = {
        username: 'AvailableUsername',
      };

      request(app)
        .post('/api/users/usernames')
        .set('Accept', 'application/json')
        .send(fakeUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, resp) => {
          expect(resp.body).to.be.an('object');
          expect(resp.body.isUsernameAvailable).to.be.a('boolean');
          expect(resp.body.isUsernameAvailable).to.equal(true);
          done();
        });
    });
  });

  describe(infoLog('/api/users/me'), () => {

    let token = null;

    before(done => {
      request(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(mockUser)
        .end((err, resp) => {
          token = resp.body.token;
          done();
        });
    });

    it('should get owner of the token on /api/users/me', done => {
      request(app)
        .get('/api/users/me')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((error, resp) => {
          expect(resp.body.username).to.equal(mockUser.username);
          done();
        });
    });
  });

  describe(infoLog('/api/users/:id'), () => {

    let token = null;
    let user = null;

    beforeEach(done => {
      request(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(mockUser)
        .end((err, resp) => {
          token = resp.body.token;
          request(app)
            .get('/api/users/me')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((error, resp) => {
              user = resp.body;
              done();
            });
        });
    });

    it('should get one user', done => {
      request(app)
        .get(`/api/users/${user._id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, newResp) => {
          expect(newResp.body).to.be.an('object');
          expect(newResp.body.username).to.equal(mockUser.username);
          done();
        });
    });

    it('should put a user', done => {
      const updatedData = {
        username: 'TesterTommy',
      };

      request(app)
        .put(`/api/users/${user._id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, newResp) => {
          expect(newResp.body).to.be.an('object');
          expect(newResp.body.username).to.equal(updatedData.username);
          done();
        });
    });

    it('should delete a user', done => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, newResp) => {
          expect(newResp.body).to.be.an('object');
          expect(newResp.body.username).to.equal(mockUser.username);
          done();
        });
    });
  });
});

describe(infoLog('AUTH'), () => {

  const mockUser = {
    username: 'TesterTimmy',
    password: 'test123',
  };

  const fakeUser = {
    username: 'AvailableUsername',
    password: 'whatever',
  };

  before(async () => {
    const newUser = new User(mockUser);
    try {
      await newUser.save();
    } catch (error) {
      console.log(error);
    }
  });

  after(() => {
    User.remove({}, err => {
      if (err) {
        console.error(errorLog('Error while cleaning the Test DB'));
      }
    });
  });

  describe(infoLog('/signin'), () => {

    it('should sign valid user in', done => {
      request(app)
        .post('/auth/signin')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, resp) => {
          expect(resp.body).to.be.an('object');
          expect(resp.body.token).to.be.a('string');
          done();
        });
    });

    it('should not sign invalid user in', done => {
      request(app)
        .post('/auth/signin')
        .set('Accept', 'application/json')
        .send(fakeUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, resp) => {
          expect(resp.body).to.be.an('object');
          expect(resp.body.error).to.be.a('string');
          done();
        });
    });
  });

});

describe(infoLog('TODOS'), () => {

  const mockUser = {
    username: 'TesterTimmy',
    password: 'test123',
  };

  const mockTodo = {
    'title': 'Write Better Tests',
    'description': 'I have to learn how to write better tests.',
    'duration': 1000,
    'date': '2018-05-22T22:00:00.000Z',
  };


  afterEach(() => {
    Todo.remove({}, err => {
      if (err) {
        console.error(errorLog('Error while cleaning the Test DB'));
      }
    });

    User.remove({}, err => {
      if (err) {
        console.error(errorLog('Error while cleaning the Test DB'));
      }
    });
  });

  describe(infoLog('/api/todos'), () => {
    let token = null;

    beforeEach(done => {
      request(app)
        .post('/api/users')
        .send(mockUser)
        .set('Accept', 'application/json')
        .end((err, resp) => {
          token = resp.body.token;
          done();
        });
    });

    it('should post a todo', done => {
      request(app)
        .post('/api/todos')
        .send(mockTodo)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, resp) => {
          expect(resp.body).to.be.an('object');
          expect(resp.body.title).to.equal(mockTodo.title);
          expect(resp.body.description).to.equal(mockTodo.description);
          expect(resp.body.duration).to.equal(mockTodo.duration);
          done();
        });
    });

    it('should get all todos', done => {
      request(app)
        .get('/api/todos')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, resp) => {
          expect(resp.body).to.be.an('array');
          expect(resp.body.length).to.equal(0);
          done();
        });
    });
  });

  describe(infoLog('/api/todos/:id'), () => {

    let token = null;
    let todo = null;

    beforeEach(done => {
      request(app)
        .post('/api/users')
        .send(mockUser)
        .set('Accept', 'application/json')
        .end((err, resp) => {
          token = resp.body.token;
          request(app)
            .post('/api/todos')
            .send(mockTodo)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((err, resp) => {
              todo = resp.body;
              done();
            });
        });
    });

    it('should get one todo', done => {
      request(app)
        .get(`/api/todos/${todo._id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, newResp) => {
          expect(newResp.body).to.be.an('object');
          expect(newResp.body.title).to.equal(mockTodo.title);
          expect(newResp.body.description).to.equal(mockTodo.description);
          expect(newResp.body.duration).to.equal(mockTodo.duration);
          done();
        });
    });

    it('should put a todo', done => {
      const updatedData = {
        title: 'Write Even Better Tests',
      };
      request(app)
        .put(`/api/todos/${todo._id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, newResp) => {
          expect(newResp.body).to.be.an('object');
          expect(newResp.body.title).to.equal(updatedData.title);
          expect(newResp.body.description).to.equal(mockTodo.description);
          expect(newResp.body.duration).to.equal(mockTodo.duration);
          done();
        });
    });

    it('should delete a todo', done => {
      request(app)
        .delete(`/api/todos/${todo._id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, newResp) => {
          expect(newResp.body).to.be.an('object');
          expect(newResp.body.title).to.equal(mockTodo.title);
          expect(newResp.body.description).to.equal(mockTodo.description);
          expect(newResp.body.duration).to.equal(mockTodo.duration);
          done();
        });
    });
  });
});
