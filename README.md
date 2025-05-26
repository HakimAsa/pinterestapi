# 📌 Pinterest Clone API

A RESTful API built with **Node.js**, **Express**, and **MongoDB** that powers a Pinterest-like application where users can create, like, comment, and save pins.

---

## 🚀 Live URL

**Backend**: [https://your-backend-url.com/api](https://your-backend-url.com/api)
**Frontend** (optional): [https://your-frontend-url.com](https://your-frontend-url.com)

---

## 🧰 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (if implemented)
- **Environment**: node --env-file=.env

---

## 📦 Installation

```bash
git clone https://github.com/HakimAsa/pinterestapi.git .
npm install
npm run dev
```

## 📂 Project Structure

```
pinterestapi
├── src
├── tests
├── .env
├── .gitignore
├── .eslintrc.json
├── package-lock.json
├── package.json
├── README.md
├── seed.js
├── index.js
```

## 📄 Documentation

### Endpoints

| Method | Endpoint                         | Description                          | Auth Required |
| ------ | -------------------------------- | ------------------------------------ | ------------- |
| POST   | `/api/v1/users/auth/register`    | Register a new user                  | No            |
| POST   | `/api/v1/users/auth/login`       | Login a user                         | No            |
| POST   | `/api/v1/users/auth/logout`      | Logout a user                        | Yes           |
| GET    | `/api/v1/users`                  | Get all users                        | Yes           |
| GET    | `/api/v1/users/:id`              | Get a user by ID                     | Yes           |
| GET    | `/api/v1/users/me`               | Get the authenticated user's profile | Yes           |
| PUT    | `/api/v1/users/:id`              | Update a user by ID                  | Yes           |
| PATCH  | `/api/v1/users/:id`              | Partially update a user by ID        | Yes           |
| DELETE | `/api/v1/users/:id`              | Delete a user by ID                  | Yes           |
| POST   | `/api/v1/pins/create`            | Create a new pin                     | Yes           |
| POST   | `/api/v1/pins/:pinId/interact`   | Like/Save a pin                      | Yes           |
| POST   | `/api/v1/pins/:pinId/comment`    | Comment on a pin                     | Yes           |
| PUT    | `/api/v1/pins/:pinId`            | Update a pin by ID                   | Yes           |
| PATCH  | `/api/v1/pins/:pinId`            | Partially update a pin by ID         | Yes           |
| GET    | `/api/v1/pins`                   | Get all pins                         | Yes           |
| GET    | `/api/v1/pins/:pinId`            | Get a pin by ID                      | Yes           |
| DELETE | `/api/v1/pins/:pinId`            | Delete a pin by ID                   | Yes           |
| GET    | `/api/v1/users/follow/:username` | Get user followers and followings    | Yes           |

````

### Example Request

```bash
curl -X POST "https://your-backend-url.com/api/v1/users/auth/register" \
-H "Content-Type: application/json" \
-d '{
  "username": "exampleUser",
  "email": "test@gmail.com",
  "password": "examplePassword",
  displayName: "Example User"
}'
````

### Example Response

```json
{
  "sucess": true,
  "message": "User registered successfully"
}
```

### Error Handling

```json
{
  "success": false,
  "message": "Error message",
  // Optional stack trace for debugging in development
  "stack": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

### Seed Data

To populate the database with initial data, run the following command:

```bash
npm run seed
```

### Testing

To run tests, use the following command:

```bash
npm test
```

### Linting

To lint the code, use the following command:

```bash
npm run lint
```
