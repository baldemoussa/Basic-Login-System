# Basic Login System

An Express API for creating an account and signing in. Users are stored in MongoDB.

## Description

Passwords are hashed with bcrypt before they are saved, and a successful login returns a JSON Web Token that expires in one hour. There is no HTML page. These screenshots are the JSON the API returned when the server was running.

Send JSON with `Content-Type: application/json`.

### `POST /api/users/register`

```json
{
  "username": "maya_chen",
  "email": "maya.chen@example.com",
  "password": "coffee123"
}
```

Returns `201` and the saved user, without the password. New users get the `user` role. Returns `400` if the email is already registered, or if a required field is missing or too short.

### `POST /api/users/login`

```json
{
  "email": "grind.reader@example.com",
  "password": "coffee123"
}
```

Returns `200` with `token` and `user`. The token payload is the user id and username, and it expires in one hour. Returns `400` with `Incorrect email or password.` when the email is unknown or the password does not match.

| Field | Rule |
| --- | --- |
| `username` | Required, unique, trimmed |
| `email` | Required, unique, must look like an email |
| `password` | Required, at least 7 characters, hashed before save |
| `role` | `user` or `admin`, defaults to `user` |

## Screenshots

### Register

`POST /api/users/register` creates the user and leaves the password out of the response.

![201 Created response with the new user and no password field](docs/screenshots/register-created.png)

### Login

![200 OK response with a JWT and the user object](docs/screenshots/login-success.png)

### Duplicate email

![400 response saying this user already exists](docs/screenshots/duplicate-user.png)

### Wrong password

A bad email or password returns the same message, so the response does not reveal which one was wrong.

![400 response saying incorrect email or password](docs/screenshots/wrong-password.png)

### Short password

The password must be at least 7 characters.

![400 response saying the password must be at least 7 characters long](docs/screenshots/short-password.png)

## Getting Started

### Dependencies

* Node.js and npm
* MongoDB

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Port for Express |
| `JWT_SECRET` | Secret used to sign login tokens |

### Installing

```bash
npm install
```

The server reads `.env`.

### Executing program

```bash
npm start
```

The server listens on `http://localhost:3000` unless `PORT` is set. `npm run dev` runs the server with nodemon.

## Help

A duplicate email returns 400 and says this user already exists. A bad email or password both return `Incorrect email or password.` A password shorter than 7 characters returns 400.

## Authors

[Mamadou Moussa Balde](https://www.linkedin.com/in/2mb/)

## Version History

* Current local run
    * Listened on port 3000 unless `PORT` was set
    * Register, login, duplicate email, wrong password, and a short password were captured

## License

This folder does not include a `LICENSE.md` file.

## Acknowledgments

* [README template](https://gist.github.com/DomPizzie/7a5ff55ffa9081f2de27c315f5018afc)
