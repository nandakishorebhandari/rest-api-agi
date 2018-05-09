require('dotenv').config();
process.env.NODE_ENV = 'testing';

const app = require('../server');
const request = require('supertest');
const expect = require('chai').expect;
const Todo = require('../server/api/todo/todo-model');
require('colors');

/* eslint-disable no-undef */

describe('TODOS api'.yellow, () => {

  const mockTodo = {
    title: 'Write Better Tests',
    description: 'I got to learn how to write better Tests',
    duration: 10000,
    date: 'Wed May 09 2018 19:36:31 GMT+0200 (CEST)',
  };

  afterEach(() => {
    Todo.remove({}, err => {
      if (err) {
        console.error('Error while cleaning the Test DB'.red);
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
          .end((err, resp) => {
            expect(resp.body).to.be.an('object');
            expect(resp.body.title).to.equal(mockTodo.title);
            expect(resp.body.description).to.equal(mockTodo.description);
            expect(resp.body.duration).to.equal(mockTodo.duration);
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
        };
        request(app)
          .put(`/api/todos/${todo._id}`)
          .send(updatedData)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, newResp) => {
            expect(newResp.body.title).to.equal(updatedData.title);
            expect(resp.body.description).to.equal(mockTodo.description);
            expect(resp.body.duration).to.equal(mockTodo.duration);
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
          .end((err, resp) => {
            expect(resp.body).to.be.an('object');
            expect(resp.body.title).to.equal(mockTodo.title);
            expect(resp.body.description).to.equal(mockTodo.description);
            expect(resp.body.duration).to.equal(mockTodo.duration);
            done();
          });
      });
  }).timeout(5000);

});
