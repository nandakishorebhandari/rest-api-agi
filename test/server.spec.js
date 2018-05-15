require('dotenv').config();
process.env.NODE_ENV = 'testing';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');
const Todo = require('../server/api/todo/todo-model');
const User = require('../server/api/user/user-model');
const { infoLog, errorLog, } = require('../server/utils/logger');

/* eslint-disable no-undef */

describe(infoLog('TODOS api'), () => {

  const userDraft = new User({
    username: 'TesterTimmy',
    password: 'test123',
  });

  const mockTodo = {
    title: 'Write Better Tests',
    description: 'I got to learn how to write better Tests',
    duration: 10000,
    date: 'Wed May 09 2018 19:36:31 GMT+0200 (CEST)',
    author: userDraft._id,
  };

  afterEach(() => {
    Todo.remove({}, err => {
      if (err) {
        console.error(errorLog('Error while cleaning the Test DB'));
      }
    });
  });

  it('should get all todos', done => {
    request(app)
      .get('/api/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, resp) => {
        expect(resp.body).to.be.an('array');
        done();
      });
  }).timeout(5000);

  it('should post a todo', done => {
    request(app)
      .post('/api/todos')
      .send(mockTodo)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, resp) => {
        expect(resp.body).to.be.an('object');
        expect(resp.body.title).to.equal(mockTodo.title);
        expect(resp.body.description).to.equal(mockTodo.description);
        expect(resp.body.duration).to.equal(mockTodo.duration);
        expect(resp.body.author).to.equal(mockTodo.author.toString());
        done();
      });
  }).timeout(5000);

  it('should get one todo', done => {
    request(app)
      .post('/api/todos')
      .send(mockTodo)
      .set('Accept', 'application/json')
      .end((err, resp) => {
        const todo = resp.body;
        request(app)
          .get(`/api/todos/${todo._id}`)
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
  }).timeout(5000);

  it('should put a todo', done => {
    request(app)
      .post('/api/todos')
      .send(mockTodo)
      .set('Accept', 'application/json')
      .end((err, resp) => {
        const todo = resp.body;
        const updatedData = {
          title: 'Write Even Better Tests',
          author: resp.body.author,
        };
        request(app)
          .put(`/api/todos/${todo._id}`)
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
  }).timeout(5000);

  it('should delete a todo', done => {
    request(app)
      .post('/api/todos')
      .send(mockTodo)
      .set('Accept', 'application/json')
      .end((err, resp) => {
        const todo = resp.body;
        request(app)
          .delete(`/api/todos/${todo._id}`)
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
  }).timeout(5000);

});

describe(infoLog('USERS api'), () => {

  const mockUser = {
    username: 'Tester Timmy',
    password: 'test123',
  };

  afterEach(() => {
    User.remove({}, err => {
      if (err) {
        console.error(errorLog('Error while cleaning the Test DB'));
      }
    });
  });

  it('should get all users', done => {
    request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, resp) => {
        expect(resp.body).to.be.an('array');
        done();
      });
  }).timeout(5000);

  it('should post a user', done => {
    request(app)
      .post('/api/users')
      .send(mockUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, resp) => {
        expect(resp.body).to.be.an('object');
        expect(resp.body.username).to.equal(mockUser.username);
        expect(resp.body.password).to.equal(mockUser.password);
        done();
      });
  }).timeout(5000);

  it('should get one user', done => {
    request(app)
      .post('/api/users')
      .send(mockUser)
      .set('Accept', 'application/json')
      .end((err, resp) => {
        const user = resp.body;
        request(app)
          .get(`/api/users/${user._id}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, newResp) => {
            expect(newResp.body).to.be.an('object');
            expect(newResp.body.username).to.equal(mockUser.username);
            expect(newResp.body.password).to.equal(mockUser.password);
            done();
          });
      });
  }).timeout(5000);

  it('should put a user', done => {
    request(app)
      .post('/api/users')
      .send(mockUser)
      .set('Accept', 'application/json')
      .end((err, resp) => {
        const user = resp.body;
        const updatedData = {
          username: 'TesterTommy',
        };
        request(app)
          .put(`/api/users/${user._id}`)
          .send(updatedData)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, newResp) => {
            expect(newResp.body).to.be.an('object');
            expect(newResp.body.username).to.equal(updatedData.username);
            expect(newResp.body.password).to.equal(mockUser.password);
            done();
          });
      });
  }).timeout(5000);

  it('should delete a user', done => {
    request(app)
      .post('/api/users')
      .send(mockUser)
      .set('Accept', 'application/json')
      .end((err, resp) => {
        const user = resp.body;
        request(app)
          .delete(`/api/users/${user._id}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, newResp) => {
            expect(newResp.body).to.be.an('object');
            expect(newResp.body.username).to.equal(mockUser.username);
            expect(newResp.body.password).to.equal(mockUser.password);
            done();
          });
      });
  }).timeout(5000);

});