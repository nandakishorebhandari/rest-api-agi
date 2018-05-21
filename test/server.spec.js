require('dotenv').config();
process.env.NODE_ENV = 'testing';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');
const Todo = require('../server/api/todo/todo-model');
const User = require('../server/api/user/user-model');
const { infoLog, errorLog, } = require('../server/utils/logger');


describe(infoLog('USERS'), () => {

  describe(infoLog('/api/users'), () => {

    const mockUser = {
      username: 'TesterTimmy',
      password: 'test123',
    };

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

    after(() => {
      User.remove({}, err => {
        if (err) {
          console.error(errorLog('Error while cleaning the Test DB'));
        }
      });
    });
  });

  describe(infoLog('/api/users/me'), () => {

    let token = null;

    const mockUser = {
      username: 'TesterTimmy',
      password: 'test123',
    };

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

    after(() => {
      User.remove({}, err => {
        if (err) {
          console.error(errorLog('Error while cleaning the Test DB'));
        }
      });
    });

    it('should get user on /api/users/me', done => {
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

    const mockUser = {
      username: 'TesterTimmy',
      password: 'test123',
    };

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

    afterEach(() => {
      User.remove({}, err => {
        if (err) {
          console.error(errorLog('Error while cleaning the Test DB'));
        }
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
    }).timeout(5000);

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
    }).timeout(5000);

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
    }).timeout(5000);
  });
});

describe(infoLog('TODOS'), () => {

  describe(infoLog('/api/todos'), () => {
    let token = null;

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
    }).timeout(5000);
  });

  describe(infoLog('/api/todos/:id'), () => {

    let token = null;
    let todo = null;

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
    }).timeout(5000);

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
    }).timeout(5000);

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
    }).timeout(5000);
  });
});
