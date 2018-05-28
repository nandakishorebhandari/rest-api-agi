# rest-api-agi [![Build Status](https://travis-ci.org/radlinskii/rest-api-agi.svg?branch=master)](https://travis-ci.org/radlinskii/rest-api-agi)

RESTful api in node.js for a ToDo application with [**JWT**](https://jwt.io/) authentication :closed_lock_with_key:

## :rocket: Running on [Heroku](https://rest-api-agi.herokuapp.com) with CORS enabled :ballot_box_with_check:

### Available operations

| Method | Route | Description |
| :--- | :---: | :--- |
| *POST* | `/auth/signin` | *log in* - if posted user exists send back his **token** |
| *POST* | `/api/users` | *register* new user and send back his **token** |
| *POST* | `/api/users/usernames` | *send* a username and check if it isn't already in use |
| *GET* | `/api/users/:id` | *read* your profile's data if you have a valid **token** |
| *PUT* | `/api/users/:id` | *update* your profile's information if you have a valid **token** |
| *DELETE* | `/api/users/:id` | *destroy* your profile if you have a valid **token** |
|  |  |  |
| *GET* | `/api/todos` | if you have a valid **token** *get* all of your todos |
| *POST* | `/api/todos` | if you have a valid **token** *create* new todo |
| *GET* | `/api/todos/:id` | if you have a valid **token** *read* todo's data |
| *PUT* | `/api/todos/:id` | if you have a valid **token** *update* todo's information |
| *DELETE* | `/api/todos/:id` | if you have a valid **token** *destroy* a todo |

### Example of usage

```javascript
const formData = {
  'username': 'john@doe.com',
  'password': 'sparklingkitty12',
};

const myHeaders = new Headers();
myHeaders.append('content-type', 'application/json');

const reqOptions = {
  method: 'POST',
  body: JSON.stringify(formData),
  headers: myHeaders,
};

const myRequest = new Request('https://rest-api-agi.herokuapp.com/auth/signin', reqOptions);

fetch(myRequest)
  .then(response => response.json())
  .then(response => console.log('Success:', response)) //prints token on successfull authentication
  .catch(error => console.error('Error:', error));
```
